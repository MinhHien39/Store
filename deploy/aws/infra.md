# storeamazon

# 1. VPC

- VPC and more
- Name: storeamazon-prd-vpc
- Number of Availability Zones: 2
- Number of public subnets: 2
- Number of private subnets: 2

```bash
- ap-northeast-1a
storeamazon-prd-subnet-public1-ap-northeast-1a
10.0.0.0/20

storeamazon-prd-subnet-private1-ap-northeast-1a
10.0.128.0/20

- ap-northeast-1c
storeamazon-prd-subnet-public2-ap-northeast-1c
10.0.16.0/20

storeamazon-prd-subnet-private2-ap-northeast-1c
10.0.144.0/20
```

# 2. WAF

# 3. Role:

- Name: storeamazon-prd-role-ec2-01
- Description: Role for EC2 instances in storeamazon production environment
- Policies:
  - AmazonS3FullAccess
  - AmazonSESFullAccess
  - AmazonSNSFullAccess
  - AmazonLmbdaFullAccess
  - AmazonSSMManagedInstanceCore
  - AmazonSSMFullAccess

# 4. RDS

### RDS Subnet Group

- Name: storeamazon-prd-db-subnet-group-01
- Description: Subnet group for storeamazon RDS instance
- VPC: storeamazon-prd-vpc
- Availability Zones:
  - ap-northeast-1a
  - ap-northeast-1c
- Subnets:
  - storeamazon-prd-subnet-private1-ap-northeast-1a
  - storeamazon-prd-subnet-private2-ap-northeast-1c

### RDS Instance

- Name: storeamazon-prd-db-01
- Engine: Mysql 8.4.7
- Instance Class: db.t3.micro (2 vCPU, 1 GiB RAM)
- Storage: 20 GiB (General Purpose SSD - gp3)
- VPC: storeamazon-prd-vpc
- Public access: No
- Availability Zone: ap-northeast-1a
- DB Subnet Group: storeamazon-prd-db-subnet-group-01
- info
  - ````bash
    Endpoint: storeamazon-prd-db-01.cb2s0m60qihn.ap-northeast-1.rds.amazonaws.com
    Port: 3306
    Username: admin
    Password: kP9v_N2mR7zX
    Database: storeamazon
    ```bash
    ````

# 5. Security Group

- Name: storeamazon-prd-sg-01
- Description: Security group for storeamazon production environment
- VPC: storeamazon-prd-vpc
- Outbound Rules:
  ```bash
  Type: All traffic
  Protocol: All
  Port Range: All
  Destination: 0.0.0.0/0
  Description: Allow all outbound traffic
  ```
- Inbound Rules:
  ```bash
  Type: HTTP
  Protocol: TCP
  Port Range: 80
  Source: 0.0.0.0/0
  Description: Allow HTTP traffic from anywhere
  ```
  ```bash
  Type: HTTP
  Protocol: TCP
  Port Range: 443
  Source: 0.0.0.0/0
  Description: Allow HTTPS traffic from anywhere
  ```
  ```bash
  Type: SSH
  Protocol: TCP
  Port Range: 22
  Source: 133.201.144.225/32
  Description: Allow SSH traffic from anywhere
  ```
  ```bash
  Type: Mysql/Aurora
  Protocol: TCP
  Port Range: 3306
  Source: storeamazon-prd-sg-01
  Description: Allow Mysql traffic from EC2 instances in the same security group
  ```

# 6. EC2

# Info

- Name: storeamazon-prd-ec2-01
- Instance Type: t3.medium (2 vCPU, 2 GiB RAM)
- Key Pair: cider-storeamazon.pem
- Network:
  - VPC: storeamazon-prd-vpc
  - Subnet: storeamazon-prd-subnet-public1-ap-northeast-1a
  - Auto-assign Public IP: Disabled
  - Security Group: storeamazon-prd-sg-01
- Storage:
  - Root Volume: 20 GiB (General Purpose SSD - gp3)
- IAM Role: storeamazon-prd-role-ec2-01

### Elastic IP

- Name: storeamazon-prd-eip-01
- IP: 57.182.103.190

### Setup EC2

```bash
# 1. SSH to EC2
ssh -i cider-storeamazon.pem ec2-user@57.182.103.190

# 2. Update and install necessary packages
sudo sudo yum update -y

# 3. Setup Git
sudo yum install git
git version
ssh-keygen -t ed25519 -C "tran_minh_tri@cider.systems" -f ~/.ssh/storeamazon
eval "$(ssh-agent -s)"
ls ~/.ssh/
ssh-add ~/.ssh/storeamazon
ssh-add -l
cat /root/.ssh/storeamazon.pub
ssh -T git@github.com
ls
nano ~/.ssh/config
---------
Host github.com
  IdentityFile ~/.ssh/storeamazon
  IdentitiesOnly yes
---------
git clone git@github.com:cider2022/storeamazon.git

# 4. Setup Docker
cat /etc/os-release
nano init-docker.sh
chmod +x init-docker.sh
sh init-docker.sh

# 5. Setup Swap
nano setup-swap.sh
chmod +x setup-swap.sh
sudo ./setup-swap.sh

# 6. Setup Mysql Client
sudo dnf install mariadb105 -y
mysql --version

# 7. Test connection to RDS
mysql -h storeamazon-prd-db-01.cb2s0m60qihn.ap-northeast-1.rds.amazonaws.com -P 3306 -u admin -p

kP9v_N2mR7zX
```


# 8. Setup JST Timezone
sudo timedatectl set-timezone Asia/Tokyo
sudo timedatectl set-timezone Asia/Tokyo
timedatectl status

```

# 7. ALB

### Register ACM

- Region: north-east-1 (Tokyo)
- Domain: storeamazon.com, \*.storeamazon.com

### Target Group

- Name: storeamazon-prd-tg-01
- Target Type: Instances
- Protocol: HTTP
- Port: 80
- VPC: storeamazon-prd-vpc
- Health Check path: /health
- Advanced Health Check settings:
  - Healthy threshold: 3
  - Unhealthy threshold: 2
  - Timeout: 5 seconds
  - Interval: 30 seconds
  - Healthy HTTP codes: 200
- Register Targets:
  - storeamazon-prd-ec2-01 (Port 80)

### ALB

- Name: storeamazon-prd-alb-01
- Layer Type: Application Load Balancer
- Scheme: Internet-facing
- IP address type: IPv4
- VPC: storeamazon-prd-vpc
- Subnets:
  - storeamazon-prd-subnet-public1-ap-northeast-1a
  - storeamazon-prd-subnet-public2-ap-northeast-1c
- Security Group: storeamazon-prd-sg-01
- Listeners:
  - HTTP:80
    - Protocol: HTTP
    - Port: 80
    - Default Action: Forward to storeamazon-prd-tg-01
  - HTTPS:443
    - Protocol: HTTPS
    - Port: 443
    - Default Action: Forward to storeamazon-prd-tg-01
- SSL Certificate: storeamazon.com

# 8. Cloudfront

### Register ACM

- Region: ue-east-1 (N. Virginia)
- Domain: storeamazon.com, \*.storeamazon.com

### CloudFront Distribution

- Name: storeamazon-prd-cf-01
- Description: CloudFront distribution for storeamazon production environment
- Origin Type: ALB
- Origin Domain Name: storeamazon-prd-alb-01-867159936.ap-northeast-1.elb.amazonaws.com
- Alternate Domain Names (CNAMEs): storeamazon.com, www.storeamazon.com
- TLS Certificate: storeamazon.com
- Info:

```bash
# 1. Distribution Domain Name
d3pf26phtc9lfn.cloudfront.net

# 2. Distribution ARN
arn:aws:cloudfront::565718662597:distribution/E1BIYI5CZ19LWY
```

### Cloudfront Behavior Settings (For Authorization API)

- Path Pattern: /api/\*
- Viewer Protocol Policy: Redirect HTTP to HTTPS
- Allowed HTTP Methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
- Cache policy: CachingDisabled
- Origin Request Policy: AllViewer

### WAF

- Name: storeamazon-prd-waf-01
- Rule 1: Block All requests outside of Japan
  - Action: Allow
  - Rule Name: storeamazon-prd-waf-rule-01
  - Country: Japan
- Rule 2: Rate Limit 300 requests/5 minutes
  - Action: Count
  - Rule Name: storeamazon-prd-waf-rule-02
  - Rate limit: 300 requests/5 minutes

# 9. S3

- S3 bucket: storeamazon-prd-bucket-01
- Block Public Access: Enabled
- Permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": ["arn:aws:iam::565718662597:role/storeamazon-prd-role-ec2-01"]
      },
      "Action": [
        "s3:ListBucket",
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::storeamazon-prd-bucket-01",
        "arn:aws:s3:::storeamazon-prd-bucket-01/*"
      ]
    }
  ]
}
```

# 10. SES

- Verified domain: storeamazon.com
- Verified email address: tran_minh_tri@cider.systems
- Custom policy: storeamazon-prd-ses-policy-01

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": [
          "arn:aws:iam::565718662597:role/storeamazon-prd-role-ec2-01",
          "arn:aws:iam::565718662597:user/tri"
        ]
      },
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail",
        "ses:SendTemplatedEmail",
        "ses:SendBulkTemplatedEmail"
      ],
      "Resource": "arn:aws:ses:ap-northeast-1:565718662597:identity/storeamazon.com"
    }
  ]
}
```

# 11. Route53

- Hosted Zone: storeamazon.com
- DNS Record (3 records from SES):
  - Name:
  - Type: CNAME
  - Value:

- DNS Record (CloudFront):
  - Name: storeamazon.com
  - Type: A
  - Alias: Yes
  - Alias Target: Alias to CloudFront distribution
    - Value: d3pf26phtc9lfn.cloudfront.net
     
- DNS Record (CloudFront):
  - Name: www.storeamazon.com
  - Type: A
  - Alias: Yes
  - Alias Target: Alias to CloudFront distribution
    - Value: d3pf26phtc9lfn.cloudfront.net
  
- DNS record (ALB):
  - Name: api.storeamazon.com
  - Type: A
  - Alias: Yes
  - Alias Target: Alias to ALB
    - Value: storeamazon-prd-alb-01-867159936.ap-northeast-1.elb.amazonaws.com

# 12. Test

### Check AWS Cli work on EC2

```bash
# 1. Aws Cli
aws sts get-caller-identity

# 2. Test connection to s3
aws s3 ls
aws s3 ls s3://storeamazon-prd-bucket-01

# 3. Test SES
aws sesv2 list-email-identities

aws sesv2 send-email \
  --from-email-address "info@storeamazon.com" \
  --destination "ToAddresses=tran_minh_tri@cider.systems" \
  --content "Simple={Subject={Data=Test SES},Body={Text={Data=Hello from EC2}}}"

```

### Test connection to RDS from EC2

```bash
# 1. SSH to VM
ssh -i cider-storeamazon.pem ec2-user@57.182.103.190

# 2. Test connection to RDS from EC2
mysql -h storeamazon-prd-db-01.cb2s0m60qihn.ap-northeast-1.rds.amazonaws.com -P 3306 -u admin -p

kP9v_N2mR7zX
```

### Test URL

```bash
sudo python3 -m http.server 80


curl -I https://d3pf26phtc9lfn.cloudfront.net
curl -I http://storeamazon.com
```
