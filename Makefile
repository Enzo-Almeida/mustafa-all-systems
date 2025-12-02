.PHONY: help deploy deploy-infra deploy-backend deploy-web deploy-mobile migrate check-health

# Configuration
AWS_REGION ?= sa-east-1
PROJECT_NAME = promo-gestao
ENVIRONMENT ?= prod

help: ## Mostra esta mensagem de ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

deploy: ## Deploy completo (infra + backend + web)
	@./deploy.sh

deploy-infra: ## Deploy apenas da infraestrutura
	@echo "1" | ./deploy.sh || true

deploy-backend: ## Deploy apenas do backend
	@echo "2" | ./deploy.sh || true

deploy-web: ## Deploy apenas do frontend web
	@echo "3" | ./deploy.sh || true

deploy-migrations: ## Executar migrações do banco
	@echo "5" | ./deploy.sh || true

check-health: ## Verifica saúde da API
	@echo "Verificando saúde da API..."
	@API_URL=$$(cd infra/terraform && terraform output -raw api_url 2>/dev/null || echo "https://api.mustafa.ozentech"); \
	curl -f $$API_URL/health && echo "✅ API está saudável" || echo "❌ API não está respondendo"

check-logs: ## Mostra logs do backend
	@aws logs tail /ecs/$(PROJECT_NAME)-backend --follow --region $(AWS_REGION)

check-status: ## Verifica status dos serviços
	@echo "Verificando status do ECS..."
	@aws ecs describe-services \
		--cluster $(PROJECT_NAME)-cluster \
		--services $(PROJECT_NAME)-backend-service \
		--region $(AWS_REGION) \
		--query 'services[0].{Status:status,Running:runningCount,Desired:desiredCount,Deployments:deployments[*].{Status:status,TaskDef:taskDefinition}}' \
		--output table

setup: ## Configuração inicial (cria terraform.tfvars)
	@cd infra/terraform && \
	if [ ! -f terraform.tfvars ]; then \
		cp terraform.tfvars.example terraform.tfvars && \
		echo "✅ terraform.tfvars criado. Por favor, edite com seus valores."; \
	else \
		echo "⚠️  terraform.tfvars já existe."; \
	fi

clean: ## Limpa arquivos temporários
	@rm -f infra/terraform/tfplan
	@rm -f infra/terraform/.terraform.lock.hcl
	@echo "✅ Arquivos temporários removidos"

destroy: ## ⚠️  DESTRÓI toda a infraestrutura
	@echo "⚠️  ATENÇÃO: Isso irá DESTRUIR toda a infraestrutura!"
	@read -p "Tem certeza? Digite 'destroy' para confirmar: " confirm && \
	[ "$$confirm" = "destroy" ] && \
	cd infra/terraform && terraform destroy || \
	echo "Operação cancelada"

