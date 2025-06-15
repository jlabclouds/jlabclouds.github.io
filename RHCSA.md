- Credit to <a href="https://www.youtube.com/@harunaadoga" target="_blank" rel="noopener noreferrer">Haruna Adoga</a>
# Section1: Understand & Use Essential Linux Tools
## Task 1: Text search and Archive - man pages
- 1.1 Find the string "listen" in /etc/httpd/conf/httpd.conf and save the output to /root/web.Text
```bash
$ grep listen /etc/httpd/conf/httpd.conf >> /root/web.txt
$ ls -a /root/web.txt
$ cat /root/web.txt
```

- 1.2 Create a gzip-compressed tar archive of/
    etc named etc_vault.tar.gz in /vaults dir.
        - use man pages for gzip option
```bash
$ mkdir ~./vaults
$ man tar
$ tar cvfz ~./vaults/etc_vault.tar.gz /etc
$ ls -a ~./vaults/etc_vault.tar.gz
```

## Task 2: File Links - Shortcuts
- 2.1 In /shorts dir.:
    - Create a file file_a
```bash
$ mkdir /shorts && cd /shorts
$ touch file_a
$ man ln
```
- 2.2 Create soft link file_b pointing to file_a
```bash 
$ ln -s file_a file_b
```
- 2.3 Create hard link file_c pointing to file_a
```bash
$ ln file_a file_c
```
- 2.4 Verify
```bash
$ ls -al
$ echo "file testing" >> file_a
$ cat file_b
$ cat file_c
```

## Task 3: Advanced File Operations - Find
- 3.1 Find file in ~/usr that are greater than 3MB but < 10MB and copy them to /bigfiles dir.
```bash 
$ man find
$ mkdir /bigfiles
$ # find ~/usr -type f -size +3M -size -10M -exec cp {} /bigfiles \;
$ ls /bigfiles
```
- 3.2 Find files in /etc modified > 120 days ago and copy them to /var/tmp/twenty/
```bash
$ mkdir /var/tmp/twenty/
$ find /etc -type f -mtime +120 exec cp {} /var/tmp/twenty \;
$ ls /var/tmp/twenty
```

- 3.3 Find all files owned by user hadoga and copy them to /root/h-files 
```bash
$ mkdir /root/h-files
$ find /* -type f -user "username" -exec cp {} /root/h-files \;
$ ls /root/h-files/
```
- 3.4 Find a file named "httpd.conf" and save the absolute paths to /root/httpd-paths.txt
```bash
$ find / -type f -name httpd.conf >> /root/httpd-paths.txt
$ cat /root/httpd-paths.txt
```

## Task 4: Remote Access and File Permissions
- 4.1 From node1, SSH into node2 as user hadoga and:
    - Copy the contents of /etc/fstab to /var/tmp
```bash
$ ssh -p 22 "username"@ipaddress(ifconfig)
$ cp /etc/fstab /var/tmp
$ ls /var/tmp
```
- 4.2 Set the file ownership to root
```bash
$ ls -al /var/tmp/fstab
$ chown root: /var/tmp/fstab
$ chmod -x /var/tmp/fstab
```
- 4.3 Ensure no execute permissions for anyone
```bash
$ ls -al /var/tmp/fstab
```

# Section2 Create Simple Shell Scripts
## Task 1: Size-Based File Search
- 1.1 Create a shell script that:
Finds files in /usr sized >30KB but <50KB
```bash
$ cat << sudo tee | find-files(script1).sh
#!/bin/bash
# Script to find files
find /usr -type f -size +30KB -size -50KB > /root/sized_files.txt
EOF>>
```
- 1.2 Outputs results to /root/sized_files.txt
```bash
$ chmod +x find-files(script1).sh
$ ./find-files.sh
$ cat find-files.sh
$ cat root/sized_files.txt
```

## Task 2: Conditional Script (career.sh) with arg
- 2.1 Create /root/career.sh that:
    - Outputs "Yes, I'm a Systems Engineer." when run with ./career.sh me
    - Outputs "Okay, they do cloud engineering." when run with ./career.sh they
    - Outputs "Usage: ./career.sh me|they" for invalid/empty args
```bash
$ sudo nano /career.sh
```
```bash
#!/bin/bash
#Author:
#Script to check career

if ["$1" == "me"] 
then 
    echo "Yes, I'm a Systems Engineer.";
elif ["$1" == "they"]
then
    echo "Okay, they do cloud engineering.";
elif [ -z "$1"]
    echo "Please provide an argument: me|they"
else
    echo "Usage: ./career.sh me|they"
fi
```
```bash
$ ls -al career.sh
$ chmod +x career.sh
$ ./career.sh
```

## Task 3: File Processing, Input/Output Users and Groups Script
- 3.1 Write shell scripts on node1 that create users and groups according to the following params.:
    - maryam:2030:hpc_admin,hpc_managers
    - adam:2040:sysadmin,
    - jacob:2050:hpc_admin

```bash
$ nano groups.txt
```
```bash
$ hpc_admin:7070
$ hpc_managers:8080
$ sysadmin:9090
```
```bash
$ nano create_groups.sh
#!/bin/bash
while IFS=":" read group gid;
do
    echo "Creating group $group with GID $gid";
    groupadd -g $group $gid;
done < groups.txt
```
```bash
$ chmod +x create_groups.sh
```
```bash
$ ./create_groups.sh
```
```bash
$ nano users.txt
        maryam:2030:hpc_admin,hpc_managers
        adam:2040:sysadmin,
        jacob:2050:hpc_admin
```
```bash
$ nano create_users.sh
#!/bin/bash

while IFS=":" read user uid groups;
do 
    echo "Creating user $user with UID $uid belonging to groups $groups"
    useradd -G $groups -u $uid $user
```
```bash
$ chmod +x create_users.sh
$ ./create_users.sh
```

- 3.2 Write a shell script that sets the passwords of the users maryam, adam and jacob to Password@1
```bash
$ nano setpass.sh
#!/bin/bash
for user in maryam adam jacob; 
do
    echo Password@1 | passwd --stdin $user;
done
```
```bash
$ chmod +x setpass.sh
$ ./setpass.sh
```

# Section3 Operate Running Systems
## Task 1: Reset Root Password
---
- Break into node2 and set a new root password to hoppy

## Task 2: Tuning Profile Configuration and SELINUX
---
- Check the current recommended tuning profile
- Put SELinux in permissive mode on node2
- On node1 ensure network service is enabled and starts on boot

## Task 4: Persistant Journaling
---
- Configure persistant journaling on both servers to retain logs and reboots

## Task 5: Process process scheduling
---
- Start a stress-ng process on node1 with a niceness value of 19
- Adjust the niceness value of the running stress-ng process to 
- Terminate the stress-ng process

## Task 6: File Permissions & File ACLs
---
- Copy /etc/fstab to /var/tmp
- Set the file owner to root
- Ensure /var/tmp/fstab is not executable by anyone
- Configure file ACLs on the copied file to"
    - User adam: read & write
    - User maryam: no access
    - All other users: read-only

## Task 7: Secure File Transfer
- On node1, create a file node1-file.ext and securely copy (scp) to home dir of user on node2

# Section4: How to Configure Local Linux Storage
# Section5: Create and Configure File Systems
# Section6: Deploy, Configure and Maintain Linux
# Section7: How to Configure Networking on Linux
# Section8: How to Manage Users and Groups 
# Section9: Manage Linux Security
# Section10: Manage Containers
