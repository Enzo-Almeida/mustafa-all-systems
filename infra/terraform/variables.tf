# This file is intentionally left mostly empty
# Main variables are defined in main.tf for better organization
# Additional variables can be added here if needed

variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to access the application"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}



