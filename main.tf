terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }
  required_version = ">= 0.14.9"
}

provider "random" {}

# unique name
resource "random_string" "unique_name" {
  length  = 8
  special = false
  numeric = false
}

locals {
  mysql  = file("./script/mysql.sh")
  node   = file("./script/node.sh")
  source = file("./script/source.sh")
}
provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}

resource "aws_instance" "intern_exam_instance" {
  ami           = var.ami_id
  instance_type = var.ec2_instance_type
  key_name      = var.key_pair_name
  tags = {
    Name        = "${var.tag_name_instance}"
    Terraform   = "true"
    Environment = "dev"
  }
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name
  user_data              = data.template_cloudinit_config.master.rendered
  vpc_security_group_ids = [aws_security_group.ec2_sg.id]
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "ec2-profile-${var.tag_name_instance}"
  role = aws_iam_role.ec2_role.name
}

resource "aws_security_group" "ec2_sg" {
  name        = "ec2-sg-${var.tag_name_instance}"
  description = "Allow http inbound traffic"
  # vpc_id      = data.aws_vpc.GetVPC.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = var.cidr_blocks
  }

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = var.cidr_blocks
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = var.cidr_blocks
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.cidr_blocks
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    Name = "terraform-ec2-security-group-${var.tag_name_instance}"
  }
}

resource "aws_eip" "eip_ec2" {
  instance = aws_instance.intern_exam_instance.id
  vpc      = true
}

# Create SSM & Maintenance Window

resource "aws_ssm_maintenance_window" "start_window" {
  name                       = "start-maintenance-window-${var.tag_name_instance}"
  schedule                   = "cron(${var.cron_start})" # Daily schedule
  duration                   = 1
  cutoff                     = 0
  allow_unassociated_targets = true
}

resource "aws_ssm_maintenance_window_target" "start_target" {
  window_id     = aws_ssm_maintenance_window.start_window.id
  resource_type = "INSTANCE"
  targets {
    key    = "tag:Name"
    values = [aws_instance.intern_exam_instance.id]
  }
}

resource "aws_ssm_maintenance_window_target" "stop_target" {
  window_id     = aws_ssm_maintenance_window.stop_window.id
  resource_type = "INSTANCE"
  targets {
    key    = "tag:Name"
    values = [aws_instance.intern_exam_instance.id]
  }
}

resource "aws_ssm_maintenance_window_task" "start_instance_task" {
  max_concurrency  = 2
  max_errors       = 1
  window_id        = aws_ssm_maintenance_window.start_window.id
  task_type        = "AUTOMATION"
  task_arn         = data.aws_ssm_document.start_instance_document.name
  service_role_arn = aws_iam_role.ec2_role.arn
  targets {
    key    = "InstanceIds"
    values = [aws_instance.intern_exam_instance.id]
  }
  task_invocation_parameters {
    automation_parameters {
      document_version = "$LATEST"
      parameter {
        name   = "InstanceId"
        values = [aws_instance.intern_exam_instance.id]
      }
    }
  }
}
resource "aws_ssm_maintenance_window" "stop_window" {
  name                       = "stop-maintenance-window-${var.tag_name_instance}"
  schedule                   = "cron(${var.cron_stop})"
  duration                   = 2
  cutoff                     = 1
  allow_unassociated_targets = true
}

resource "aws_ssm_maintenance_window_task" "stop_instance_task" {
  max_concurrency  = 2
  max_errors       = 1
  window_id        = aws_ssm_maintenance_window.stop_window.id
  task_type        = "AUTOMATION"
  task_arn         = data.aws_ssm_document.stop_instance_document.name
  service_role_arn = aws_iam_role.ec2_role.arn
  targets {
    key    = "InstanceIds"
    values = [aws_instance.intern_exam_instance.id]
  }
  task_invocation_parameters {
    automation_parameters {
      document_version = "$LATEST"
      parameter {
        name   = "InstanceId"
        values = [aws_instance.intern_exam_instance.id]
      }
    }
  }
}

# roles
resource "aws_iam_role" "ec2_role" {
  name = "ec2-role-intern-exam-${var.tag_name_instance}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ssm.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "ssm_policy" {
  name        = "ssmAutomationPolicy-${random_string.unique_name.result}"
  description = "Policy for EC2 to start using SSM Automation"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "ssm:*",
          "ec2:*"
        ],
        Effect   = "Allow",
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_policy_attachment" "ssm_attachment" {
  name       = "ssm-automation-attachment-${random_string.unique_name.result}"
  roles      = [aws_iam_role.ec2_role.name]
  policy_arn = aws_iam_policy.ssm_policy.arn
}
