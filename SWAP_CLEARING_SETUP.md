# Automated Swap Clearing Setup

This guide covers setting up automated weekly swap clearing using a cron job.

## Option B: Automated Weekly Swap Clearing

### Method 1: Restart Supervisord Services (Recommended)

This method restarts all supervisord services, which clears swap memory used by those services.

#### Step 1: Create the Swap Clearing Script

```bash
# Create the script
sudo nano /usr/local/bin/clear-swap-weekly.sh
```

Add the following content:

```bash
#!/bin/bash

# Automated Swap Clearing Script
# Runs weekly to clear swap by restarting supervisord services

LOG_FILE="/var/log/swap-clearing.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting swap clearing process..." >> $LOG_FILE

# Check swap usage before
SWAP_BEFORE=$(free -h | grep Swap | awk '{print $3}')
echo "[$DATE] Swap usage before: $SWAP_BEFORE" >> $LOG_FILE

# Restart all supervisord services
echo "[$DATE] Restarting supervisord services..." >> $LOG_FILE
supervisorctl restart all >> $LOG_FILE 2>&1

# Wait for services to restart
sleep 10

# Check swap usage after
SWAP_AFTER=$(free -h | grep Swap | awk '{print $3}')
echo "[$DATE] Swap usage after: $SWAP_AFTER" >> $LOG_FILE

# Check service status
echo "[$DATE] Service status:" >> $LOG_FILE
supervisorctl status >> $LOG_FILE

echo "[$DATE] Swap clearing completed." >> $LOG_FILE
echo "----------------------------------------" >> $LOG_FILE
```

#### Step 2: Make the Script Executable

```bash
sudo chmod +x /usr/local/bin/clear-swap-weekly.sh
```

#### Step 3: Test the Script First (IMPORTANT)

```bash
# Run the script manually to test
sudo /usr/local/bin/clear-swap-weekly.sh

# Check the log
tail -f /var/log/swap-clearing.log

# Verify services are running
supervisorctl status

# Check swap is cleared
free -h
```

#### Step 4: Set Up the Cron Job

```bash
# Edit root's crontab (requires sudo)
sudo crontab -e
```

Add one of the following lines:

**Option A: Every Sunday at 3 AM** (Recommended - low traffic time)
```cron
0 3 * * 0 /usr/local/bin/clear-swap-weekly.sh
```

**Option B: Every Monday at 2 AM**
```cron
0 2 * * 1 /usr/local/bin/clear-swap-weekly.sh
```

**Option C: Every Saturday at 4 AM**
```cron
0 4 * * 6 /usr/local/bin/clear-swap-weekly.sh
```

#### Cron Schedule Explanation:
```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, both 0 and 7 are Sunday)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

#### Step 5: Verify Cron Job is Scheduled

```bash
# List root's cron jobs
sudo crontab -l

# Check cron service is running
sudo systemctl status cron
```

---

### Method 2: Aggressive Swap Clearing (Alternative)

This method disables and re-enables swap, clearing ALL swap memory.

⚠️ **Warning**: This can cause a brief performance impact if services need that swap data.

#### Create Alternative Script

```bash
sudo nano /usr/local/bin/clear-swap-aggressive.sh
```

Add:

```bash
#!/bin/bash

LOG_FILE="/var/log/swap-clearing.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting aggressive swap clearing..." >> $LOG_FILE

# Check swap before
SWAP_BEFORE=$(free -h | grep Swap | awk '{print $3}')
echo "[$DATE] Swap usage before: $SWAP_BEFORE" >> $LOG_FILE

# Disable and re-enable swap
echo "[$DATE] Disabling swap..." >> $LOG_FILE
swapoff -a

echo "[$DATE] Re-enabling swap..." >> $LOG_FILE
swapon -a

# Check swap after
SWAP_AFTER=$(free -h | grep Swap | awk '{print $3}')
echo "[$DATE] Swap usage after: $SWAP_AFTER" >> $LOG_FILE
echo "[$DATE] Aggressive swap clearing completed." >> $LOG_FILE
echo "----------------------------------------" >> $LOG_FILE
```

Make executable:
```bash
sudo chmod +x /usr/local/bin/clear-swap-aggressive.sh
```

---

## Testing on Dev Server First

### Step 1: Test Script Manually

```bash
# Check current swap usage
free -h

# Check current services
supervisorctl status

# Run the clearing script
sudo /usr/local/bin/clear-swap-weekly.sh

# Verify swap is cleared
free -h

# Verify all services restarted successfully
supervisorctl status

# Check application is working
curl http://localhost:3000/health  # Backend
curl http://localhost:5000/health  # Frontend
# Test your bot
```

### Step 2: Test Cron Job Execution

```bash
# Set up a test cron job to run in 2 minutes
# Check current time first
date

# Edit crontab
sudo crontab -e

# Add a test job (example: if current time is 14:30, set for 14:32)
32 14 * * * /usr/local/bin/clear-swap-weekly.sh

# Wait for execution and check log
tail -f /var/log/swap-clearing.log

# Once verified, edit crontab again and set the actual weekly schedule
sudo crontab -e
```

### Step 3: Monitor for a Week

```bash
# Check logs regularly
tail -f /var/log/swap-clearing.log

# Monitor swap usage
watch -n 60 free -h

# Check cron execution history
grep CRON /var/log/syslog | grep clear-swap
```

---

## Monitoring & Maintenance

### View Clearing Logs

```bash
# View all clearing operations
cat /var/log/swap-clearing.log

# View last 20 lines
tail -20 /var/log/swap-clearing.log

# Monitor in real-time
tail -f /var/log/swap-clearing.log
```

### Check Swap Usage Trends

```bash
# Current swap
free -h

# Detailed swap info
swapon --show

# What's using swap
for file in /proc/*/status ; do awk '/VmSwap|Name/{printf $2 " " $3}END{ print ""}' $file; done | sort -k 2 -n -r | head -10
```

### Adjust Schedule if Needed

```bash
# If weekly is not enough, change to every 3 days
0 3 */3 * * /usr/local/bin/clear-swap-weekly.sh

# If weekly is too frequent, change to every 2 weeks
0 3 * * 0 [ $(expr $(date +\%s) / 604800 \% 2) -eq 0 ] && /usr/local/bin/clear-swap-weekly.sh
```

---

## Troubleshooting

### Cron Job Not Running

```bash
# Check cron service
sudo systemctl status cron

# Start cron if stopped
sudo systemctl start cron

# View cron logs
grep CRON /var/log/syslog | tail -20
```

### Script Fails

```bash
# Check script permissions
ls -l /usr/local/bin/clear-swap-weekly.sh

# Check log for errors
tail -50 /var/log/swap-clearing.log

# Test script manually with verbose output
sudo bash -x /usr/local/bin/clear-swap-weekly.sh
```

### Services Don't Restart Properly

```bash
# Check supervisord is running
sudo systemctl status supervisor

# Manually restart services
supervisorctl restart all

# Check for errors
supervisorctl tail <service-name> stderr
```

---

## Rollback Plan

If automated clearing causes issues:

```bash
# Remove cron job
sudo crontab -e
# Delete the line with clear-swap-weekly.sh

# Verify cron job removed
sudo crontab -l

# Optionally remove the script
sudo rm /usr/local/bin/clear-swap-weekly.sh
```

---

## Recommended Setup Timeline

### Week 1: Dev Server Testing
1. Day 1: Create and test script manually
2. Day 2: Set up test cron job (daily for testing)
3. Day 3-7: Monitor logs and service stability

### Week 2: Production Deployment
1. If dev server stable, deploy to production
2. Set weekly schedule (Sunday 3 AM recommended)
3. Monitor first execution closely

### Ongoing: Monthly Review
- Check logs for any failures
- Review swap usage trends
- Adjust schedule if needed

---

## Summary

**Recommended approach:**
1. ✅ Use Method 1 (Restart Supervisord Services)
2. ✅ Test manually on dev server first
3. ✅ Set up cron for Sunday 3 AM weekly
4. ✅ Monitor logs for first month
5. ✅ Adjust frequency based on swap usage patterns

**Key files:**
- Script: `/usr/local/bin/clear-swap-weekly.sh`
- Logs: `/var/log/swap-clearing.log`
- Cron: `sudo crontab -l` to view

**Next steps:**
1. SSH into dev server
2. Create the script
3. Test manually
4. Set up cron job
5. Monitor for issues
