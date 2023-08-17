# Webnode-JS-Intern
- Using Terraform to init infrastructure (AWS)
- Nodejs
- Docker
- Nginx
- Auto start/stop (07:00 AM -> 17:00 PM GMT+7)
- Limit access by IP


# Usage Init Infrastructure
- Install https://developer.hashicorp.com/terraform/downloads?product_intent=terraform on your remote machine (mentor machine)
- Configure your AWS information (aws configure)
- Download this repo
- Up to your git repo
- Create one file terraform.tfvars (example below)
- Run command:
  ```
    terraform init
    terraform plan -> Optional but important this command help check validation
    terraform apply --auto-approve
  ```
- Output result:
  ```
    ec2_name = "---"
    ec2_public_ip = "---"
    instance_id = "---"
    mysql_db_schema = "---"
    mysql_password = "---"
    mysql_user_name = "---"
  ```
# Remove Intrastructure
- Destroy all services by command:
  ```
    terraform destroy
    Confirm: 'Yes'
  ```

| Variables    | Description | Required | Example
| -------- | ------- |  ------- | ------- |
| aws_region  | AWS region for your resources    |  •| ap-northeast-1|
| aws_profile | AWS profile you're using    |  • | default|
| key_pair_name    |  Key SSH   |  • |vinh-tt-personal|
| tag_name_instance    |  Tag name for instances   |  • |intern-vinh-tt|
| mysql_user_name    |  MySQL username for database access   |  • |admin|
| mysql_password    |  MySQL password for database access   |  • |Bwv@2023|
| mysql_db_schema    |  Database schema   |  • |db-intern|
| github_token    |  Your GitHub personal access token   |  • |-|
| git_url    |  URL to your Git repository   |  • |github.com/abc...|
| cron_start    |  cron regex starting time ec2   |  |0 0 0 ? * MON-FRI *|
| cron_stop    |  cron regex stopping time ec2   |   |0 12 ? * MON-FRI *|
| cidr_blocks    |  Limit access IP list(string)   |   |["118.69.72.236/32"]|
| ec2_instance_type    |  Ec2 type   |   |t2.micro|
| ami_id    |  Amazon machine image   |   |ami-04beabd6a4fb6ab6f|

# Note
- Should rotate key-pair after one Internship season
- Use only one key-pair for all instances is recommended


Demo:
https://drive.google.com/file/d/11GSkVc3J5VqL2-MTNzQZ2BamBW09Q0_V/view?usp=drive_link