# Secrets Manager - JWT Secrets
resource "aws_secretsmanager_secret" "jwt_secret" {
  name                    = "${var.project_name}-jwt-secret-${var.environment}"
  description             = "JWT secret for authentication"
  recovery_window_in_days = 7

  tags = {
    Name = "${var.project_name}-jwt-secret"
  }
}

resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id = aws_secretsmanager_secret.jwt_secret.id
  secret_string = jsonencode({
    jwt_secret         = "CHANGE_ME_GENERATE_RANDOM_STRING"
    jwt_refresh_secret = "CHANGE_ME_GENERATE_RANDOM_STRING"
  })
}

# Secrets Manager - Database Credentials
resource "aws_secretsmanager_secret" "db_credentials" {
  name                    = "${var.project_name}-db-credentials-${var.environment}"
  description             = "Database credentials"
  recovery_window_in_days = 7

  tags = {
    Name = "${var.project_name}-db-credentials"
  }
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username     = var.db_master_username
    password     = var.db_master_password
    engine       = "postgres"
    host         = aws_db_instance.main.address
    port         = 5432
    dbname       = "promo_gestao"
    DATABASE_URL = "postgresql://${var.db_master_username}:${var.db_master_password}@${aws_db_instance.main.address}:5432/promo_gestao?schema=public"
  })
}

