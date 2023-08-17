# Variables can be changed
variable "aws_region" {
  type    = string
  default = "ap-northeast-1"
}

variable "aws_profile" {
  type = string
}

variable "key_pair_name" {
  type = string
}

variable "tag_name_instance" {
  type = string
}

variable "mysql_user_name" {
  type = string
}

variable "mysql_password" {
  type = string

  validation {
    condition     = can(regex("[0-9]", var.mysql_password))
    error_message = "Invalid password. Password must contain at least 1 numeric character, 1 lowercase character, 1 uppercase character @#$%^&+=, 1 special character, and be at least 8 characters long."
  }

  validation {
    condition     = can(regex("[a-z]", var.mysql_password))
    error_message = "Invalid password. Password must contain at least 1 numeric character, 1 lowercase character, 1 uppercase character @#$%^&+=, 1 special character, and be at least 8 characters long."
  }

  validation {
    condition     = can(regex("[A-Z]", var.mysql_password))
    error_message = "Invalid password. Password must contain at least 1 numeric character, 1 lowercase character, 1 uppercase character @#$%^&+=, 1 special character, and be at least 8 characters long."
  }

  validation {
    condition     = can(regex("[@#$%^&+=]", var.mysql_password))
    error_message = "Invalid password. Password must contain at least 1 numeric character, 1 lowercase character, 1 uppercase character, 1 special character @#$%^&+=, and be at least 8 characters long."
  }

  validation {
    condition     = length(var.mysql_password) >= 8
    error_message = "Invalid password. Password must contain at least 1 numeric character, 1 lowercase character, 1 uppercase character, 1 special character @#$%^&+=, and be at least 8 characters long."
  }
}

variable "mysql_db_schema" {
  type    = string
  default = "db_intern"

  validation {
    condition     = can(regex("^[a-zA-Z][a-zA-Z0-9_]*$",var.mysql_db_schema))
    error_message = "Invalid schema name. Schema name must start with a letter and contain only letters, numbers, and underscores."
  }
}

variable "github_token" {
  type = string
}

variable "git_url" {
  type = string
}

# ================================
# Should not change variable below
variable "cron_start" {
  type        = string
  default     = "0 0 0 ? * MON-FRI *"
  description = "daily start at 07:00 AM VN time"
}

variable "cron_stop" {
  type        = string
  default     = "0 12 ? * MON-FRI *"
  description = "daily start at 17:00 PM VN time"
}

variable "cidr_blocks" {
  type    = list(string)
  default = ["118.69.72.236/32"]
}
variable "ec2_instance_type" {
  type    = string
  default = "t2.micro"
}

variable "ami_id" {
  type        = string
  description = "Linux 3"
  default     = "ami-04beabd6a4fb6ab6f" # Linux 2023
}
