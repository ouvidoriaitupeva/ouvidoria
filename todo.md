# Atualização — Ouvidoria de Itupeva

## Resolutividade e prazo

- [ ] Calcular Índice de resolutividade como concluídos ÷ protocolos registrados.
- [ ] Exibir o valor no período selecionado e após o upload da planilha.
- [ ] Confirmar regra oficial de prazo/SLA.
- [ ] Se autorizado, calcular proxy de prazo usando concluídos sem prorrogação ÷ concluídos.
- [ ] Manter a satisfação média apagada/em cinza.
- [ ] Validar e salvar checkpoint.


## Barras de tipos de manifestação

- [ ] Limitar cada barra à largura da própria coluna.
- [ ] Remover a largura multiplicada que causa invasão da coluna vizinha.
- [ ] Validar em desktop e mobile.
- [ ] Salvar checkpoint.


## Estado dos indicadores

- [ ] Manter somente “Satisfação média” apagada/em cinza.
- [ ] Reativar “Índice de resolutividade”.
- [ ] Reativar “Dentro do prazo”.
- [ ] Validar e salvar checkpoint.


## XLSX local e privacidade

- [ ] Não publicar a planilha original com dados pessoais.
- [ ] Criar botão para carregar o XLSX somente no navegador.
- [ ] Recalcular os indicadores após o upload local.
- [ ] Exibir aviso de que o arquivo não é enviado ao servidor.
- [ ] Validar o painel com e sem arquivo carregado.


## Integração direta da planilha XLSX

- [ ] Verificar tamanho e estrutura da planilha para uso no navegador.
- [ ] Incluir o XLSX como fonte direta do frontend.
- [ ] Ler as linhas originais no navegador e aplicar os filtros de período.
- [ ] Recalcular protocolos, status, categorias, secretarias e assuntos diretamente das linhas.
- [ ] Validar divergências contra a planilha original.
- [ ] Salvar checkpoint da integração.


## Auditoria da planilha-fonte

- [ ] Mapear colunas, preenchimento e tipos de dados da planilha.
- [ ] Calcular totais por status, categoria, secretaria e período.
- [ ] Comparar esses totais com metricas.json.
- [ ] Identificar registros, datas ou campos que causem discrepâncias.
- [ ] Corrigir a fonte temporária com números reconciliados.
- [ ] Informar campos vazios ou inconsistentes que dependem de saneamento.

## Auditoria de divergência dos dados

- [ ] Comparar o total exibido com os totais por campo do JSON.
- [ ] Confirmar a semântica de f, c, fab, fcc e fcn.
- [ ] Confirmar a janela padrão usada pelo arquivo e pelo dashboard.
- [ ] Verificar se “c” é concluído, cadastro, consulta ou outra dimensão.
- [ ] Corrigir somente os indicadores com definição confirmada.
- [ ] Informar claramente as métricas que exigem definição da Ouvidoria.


## Dados temporários via metricas.json

- [ ] Comparar o arquivo com os indicadores exibidos e listar lacunas.
- [ ] Informar ao usuário qualquer métrica ausente antes da entrega.


- [ ] Ler a estrutura e os nomes dos campos do arquivo enviado.
- [ ] Copiar o arquivo para a fonte estática do projeto.
- [ ] Alimentar KPIs e blocos da visão geral com os dados do arquivo.
- [ ] Manter satisfação média visível, cinza e sem valor enquanto não houver dado.
- [ ] Tratar ausência de campos sem quebrar a página.
- [ ] Validar a leitura e salvar checkpoint.


## Revisão da visão geral

- [ ] Remover “Painel de indicadores”.
- [ ] Adicionar períodos: últimos 12 meses, últimos 6 meses, este mês e período personalizado.
- [ ] Renomear “Registros avaliados” para “Protocolos registrados”.
- [ ] Remover subtítulos e tags auxiliares solicitados: “Distribuição percentual no período.”, “Agregado”, “Total mensal, sem identificação individual.”, “Registros agregados”, “Comparativo agregado para apoiar a fiscalização.”, “Distribuição agregada dos temas registrados no período.” e “Sem identificação”.
- [ ] Criar seletor colorido para “Concluídos”, “Abertos” e “Registrados” em Evolução dos registros.
- [ ] Validar a página e salvar checkpoint.


## GitHub Pages

- [ ] Identificar o repositório remoto e a branch publicada.
- [ ] Verificar se os arquivos atuais estão sincronizados no GitHub.
- [ ] Verificar workflows e configuração do GitHub Pages.
- [ ] Corrigir build, base path ou publicação, se necessário.
- [ ] Validar a URL publicada e informar a diferença para a hospedagem integrada.


## Lateral

- [ ] Remover o bloco “Visão institucional”.
- [ ] Deixar a lateral sem texto promocional ou institucional nessa área.
- [ ] Validar o espaçamento do menu e salvar checkpoint.


## Formulário de registro

- [ ] Mover a identificação para a última etapa do formulário.
- [ ] Tornar a identificação opcional, sem exigir nome, documento ou contato.
- [ ] Oferecer login gov.br somente como opção de identificação no final.
- [ ] Manter a possibilidade de concluir sem identificação.


- [ ] Trocar “Título curto” por “Assunto”.
- [ ] Incluir identificação do local da ocorrência.
- [ ] Criar escolha entre manifestação identificada e não identificada.
- [ ] Incluir campos de nome, documento, e-mail e telefone quando a pessoa optar por se identificar.
- [ ] Incluir opção de usar localização do dispositivo com permissão do navegador.
- [ ] Explicar que preenchimento automático real exige autenticação e integração segura.
- [ ] Validar o formulário e salvar checkpoint.


## Ordem dos blocos

- [ ] Mover “Assuntos” para o último bloco da visão geral.
- [ ] Validar a ordem visual e salvar checkpoint.


## Barra superior e assuntos

- [ ] Remover “Painel de fiscalização” da barra superior.
- [ ] Remover “Ouvidoria Municipal”, “Acesso institucional” e “OM”.
- [ ] Incluir quadro agregado de assuntos na visão geral.
- [ ] Validar layout e salvar checkpoint.


## Páginas e navegação

- [ ] Remover o quadro “Resumo dos indicadores / Acompanhamento por secretaria”.
- [ ] Criar rota de registro de manifestação.
- [ ] Criar página de relatórios por secretaria.
- [ ] Criar página de metas e prazos.
- [ ] Criar página de secretarias oficiais.
- [ ] Criar página de dicionário de indicadores.
- [ ] Conectar todos os itens do menu às páginas correspondentes.
- [ ] Validar navegação, formulário e responsividade.
- [ ] Salvar checkpoint da versão completa.


## Ampliação Resolveu? e ajuste do cabeçalho

- [ ] Levantar indicadores adicionais do painel Resolveu? da CGU.
- [ ] Remover o título “Indicadores por secretaria”.
- [ ] Manter “Ouvidoria de Itupeva” e o texto introdutório definido pelo usuário.
- [ ] Incorporar indicadores agregados adicionais sem mostrar manifestações.
- [ ] Validar a nova composição e salvar checkpoint.


## Ajuste de linguagem institucional

- [ ] Remover “Painel da Ouvidoria Municipal”.
- [ ] Remover “O que a população está dizendo?”.
- [ ] Remover “Onde a resolutividade pode melhorar”.
- [ ] Substituir os três títulos por nomenclatura neutra e institucional.
- [ ] Validar compilação e salvar novo checkpoint.

## Revisão visual e de indicadores — Itupeva + Resolveu?

- [ ] Consultar a identidade oficial de Itupeva e a estrutura visual do painel Resolveu? da CGU.
- [ ] Registrar fontes, cores, símbolos e indicadores de referência.
- [ ] Substituir a identidade genérica pela identidade municipal de Itupeva.
- [ ] Adaptar as métricas para eixos de resolutividade, resposta, satisfação e volume agregado.
- [ ] Validar a nova interface em desktop e mobile.
- [ ] Criar checkpoint revisado para entrega.


- [ ] Conferir a lista oficial de secretarias no portal da Prefeitura de Itupeva.
- [ ] Registrar as secretarias e as fontes oficiais usadas no redesenho.
- [ ] Remover listagens, títulos e detalhes de manifestações individuais da tela principal.
- [ ] Criar indicadores agregados por secretaria: volume, prazo, resposta, satisfação e tendência.
- [ ] Criar comparativo entre secretarias sem expor protocolo, assunto ou texto de manifestação.
- [ ] Validar linguagem simples, responsividade e acessibilidade.
- [ ] Gerar novo checkpoint para entrega.
