data "template_file" "mysql" {
  template = file("./script/mysql.sh")
  vars = {
    user_name = "${var.mysql_user_name}"
    password  = "${var.mysql_password}"
    db_schema = "${var.mysql_db_schema}"
  }
}

data "template_file" "node" {
  template = file("./script/node.sh")
  vars = {
    env = "node"
  }
}

data "template_file" "source" {
  template = file("./script/source.sh")
  vars = {
    github_token = "${var.github_token}"
    git_url      = "${var.git_url}"
  }
}

data "template_cloudinit_config" "master" {
  gzip          = true
  base64_encode = true

  part {
    content_type = "text/x-shellscript"
    content      = data.template_file.mysql.rendered
  }

  part {
    content_type = "text/x-shellscript"
    content      = data.template_file.node.rendered
  }

  part {
    content_type = "text/x-shellscript"
    content      = data.template_file.source.rendered
  }
}

data "aws_ssm_document" "start_instance_document" {
  name = "AWS-StartEC2Instance"
}

data "aws_ssm_document" "stop_instance_document" {
  name = "AWS-StopEC2Instance"
}