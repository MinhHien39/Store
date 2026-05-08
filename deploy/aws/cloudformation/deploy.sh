# AWS_PROFILE=storeamazon ./deploy/cloudformation/deploy.sh

aws cloudformation deploy \
  --template-file AutoOnOffEc2Rds.yaml \
  --stack-name storeamazon-prd-ec2-rds-schedule \
  --capabilities CAPABILITY_NAMED_IAM \
  --region ap-northeast-1

