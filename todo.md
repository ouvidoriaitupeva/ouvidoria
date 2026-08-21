# Atualização — Ouvidoria de Itupeva

## Ajuste final do banner Gabinete
- [ ] Exibir “Secretaria” e “Gabinete” no cabeçalho do banner.
- [ ] Remover “Conteúdo integral da versão anexada”.
- [ ] Remover o aviso de validação do rodapé.
- [ ] Validar e publicar novo checkpoint.


## Agrupamento do Gabinete na Carta de Serviços
- [x] Criar um único banner para a área Gabinete.
- [x] Colocar Defesa Civil e Ouvidoria dentro desse banner.
- [x] Preservar setores, serviços, busca e detalhes expansíveis.
- [x] Validar e publicar novo checkpoint.


## Simplificação final da Carta de Serviços
- [x] Remover “necessários” da descrição da busca.
- [x] Remover o aviso “Versão inicial. Validação pelos órgãos responsáveis.”.
- [x] Remover a faixa “Como encontrar o que você precisa” e seus passos.
- [x] Evitar repetir “Secretaria” nos blocos de Gabinete — Defesa Civil e Gabinete — Ouvidoria.
- [x] Validar e publicar novo checkpoint.


## Redesign da Carta de Serviços
- [ ] Avaliar a estrutura visual atual e identificar pontos de confusão.
- [ ] Reduzir o tamanho visual de títulos, cartões e blocos.
- [ ] Reorganizar busca, filtro por secretaria e lista de serviços.
- [ ] Melhorar a leitura dos detalhes de cada serviço.
- [ ] Validar desktop e mobile e publicar novo checkpoint.


## Relatórios e acesso Online
- [x] Usar nos Relatórios por secretaria os mesmos períodos da Visão geral.
- [x] Fazer “Online — Portal eOuve” abrir a página Registrar Ouvidoria.
- [x] Validar filtros, link e publicar novo checkpoint.


## Correção do tempo médio geral
- [ ] Restaurar o valor do cartão “Tempo médio de resposta” geral.
- [ ] Manter o cálculo conforme 12 meses, 6 meses, mês e período personalizado.
- [ ] Validar e publicar novo checkpoint.

## Ajuste de nomenclatura dos registros
- [x] Deixar “Tempo médio de resposta” sem dados na Visão geral.
- [x] Renomear a página para “Registrar pedido de Ouvidoria”.
- [x] Atualizar a descrição para “Registre sua manifestação ou acompanhe o andamento com o protocolo.”
- [x] Renomear a página SIC para “Registrar pedido de acesso à informação SIC”.
- [x] Atualizar a descrição do SIC para “Registre sua solicitação ou acompanhe o andamento com o protocolo.”
- [x] Renomear o menu para “Registrar Ouvidoria” e “Solicitar Informação SIC”.
- [x] Validar e publicar novo checkpoint.


## Correção da página Relatórios por secretaria
- [x] Conectar a rota /relatorios ao componente de relatórios.
- [x] Preservar todas as secretarias, filtros, barras e tempo médio.
- [x] Validar menu, rota e visualização da página.
- [x] Publicar novo checkpoint.


## Entrega pendente do PDF técnico revisado
- [x] Reaplicar a revisão funcional com integrações via API do Fala.BR.
- [x] Confirmar remoção de tecnologias específicas, Painel Resolveu?, Configurações e planilha.
- [x] Compilar e verificar o PDF.
- [x] Entregar o PDF atualizado ao usuário.

## Revisão do documento técnico para integração via API
- [ ] Remover do PDF referências a tecnologias específicas.
- [ ] Remover Painel Resolveu? e Configurações do escopo documentado.
- [ ] Remover recebimento e processamento por planilha.
- [ ] Descrever dados, consultas e integrações via API do Fala.BR e serviços institucionais.
- [ ] Manter somente a descrição funcional do que a solução faz.
- [ ] Gerar, revisar e entregar PDF atualizado.

## Documento técnico para o setor de TI
- [x] Reorientar o documento de RH para TI.
- [x] Documentar arquitetura, stack, hospedagem, deploy e rotas.
- [x] Documentar modelo de dados, processamento local e agregação.
- [x] Documentar segurança, privacidade, LGPD, backup e controle de acesso.
- [x] Documentar requisitos operacionais, manutenção, monitoramento e suporte.
- [x] Redigir recomendações técnicas e critérios de aceite.
- [x] Gerar, revisar e entregar PDF técnico.

## Documento formal para o RH
- [ ] Estruturar justificativa institucional e objetivo do projeto.
- [ ] Documentar escopo funcional: painel, manifestação, SIC, acompanhamento, relatórios e Carta de Serviços.
- [ ] Documentar privacidade, processamento local da planilha e anonimização agregada.
- [ ] Documentar indicadores, regras de cálculo e correção do tempo médio.
- [ ] Documentar requisitos de infraestrutura, dados, governança, segurança e manutenção.
- [ ] Redigir recomendações de implantação e encaminhamentos ao RH.
- [ ] Gerar, revisar e entregar PDF.


## Auditoria do tempo médio
- [x] Conferir período efetivamente usado no cálculo.
- [x] Conferir datas mínima e máxima de recebimento e finalização.
- [x] Conferir registros incluídos, finalizados e média recalculada.
- [x] Comparar o agregado salvo com o filtro da Visão geral.
- [x] Corrigir a regra se houver divergência e publicar a conclusão.
- [x] Corrigir o tratamento de formatos distintos em “Recebido em” e “Finalizado em”.
- [x] Fazer o tempo médio acompanhar 12 meses, 6 meses, mês e período personalizado.


## Tempo médio real de resposta
- [x] Inspecionar a planilha original para localizar datas de recebimento e conclusão/resposta.
- [x] Calcular o tempo médio real do período, sem usar valores fictícios.
- [x] Exibir tempo médio em Tipos de manifestação.
- [x] Exibir tempo médio no Ranking das secretarias.
- [x] Exibir tempo médio no Ranking dos Assuntos.
- [x] Atualizar o cartão geral com o valor real do período.
- [x] Validar e publicar novo checkpoint.


## Barras e tempo médio de resposta
- [x] Adicionar barras de progresso ao Ranking das secretarias.
- [x] Incluir tempo médio de resposta no Ranking dos Assuntos.
- [x] Criar cartão “Tempo médio de resposta” com o valor geral do período, se existir na fonte.
- [x] Manter o cartão visível e sem valor quando a métrica não estiver disponível, sem inventar dados.
- [x] Validar e publicar novo checkpoint.


## Remoção da página Secretarias
- [x] Retirar Secretarias do menu lateral.
- [x] Remover a rota acessível da página Secretarias.
- [x] Preservar rankings das secretarias na Visão geral e nos Relatórios.
- [x] Validar navegação e publicar novo checkpoint.


## Quantidades nos percentuais e nomes dos rankings
- [x] Exibir quantidade absoluta em cinza e menor junto de cada percentual na Visão geral.
- [x] Renomear Desempenho por secretaria para Ranking das secretarias.
- [x] Renomear Assuntos para Ranking dos Assuntos.
- [x] Validar e publicar novo checkpoint.


## Ajustes em relatórios e acompanhamento do SIC
- [x] Remover a etiqueta “Dados agregados” de todos os cartões de Relatórios por secretaria.
- [x] Adicionar no SIC o bloco Acompanhar pedido com protocolo e botão Consultar, igual ao Registrar manifestação.
- [x] Validar e publicar novo checkpoint.


## Ajustes de simplificação e organização
- [x] Simplificar o texto principal da Visão geral.
- [x] Fazer Assuntos mostrar apenas a coluna do filtro selecionado.
- [x] Retirar “Enviar uma nova solicitação” do bloco inicial do SIC.
- [x] Colocar todos os serviços de cada departamento no mesmo banner da secretaria na Carta de Serviços.
- [x] Remover o responsável nominal pela Ouvidoria e SIC da página institucional.
- [x] Remover a frase sobre conteúdo consultado no portal oficial.
- [x] Validar e publicar novo checkpoint.


## Correções de fluxo, relatórios e Carta de Serviços
- [x] Adicionar campo para acompanhar pedido em Registrar manifestação.
- [x] Remover os textos introdutórios solicitados de Registrar manifestação.
- [x] Deixar a página SIC apenas com “Enviar uma nova solicitação”.
- [x] Retirar textos introdutórios dos Relatórios por secretaria.
- [x] Restaurar os dados disponíveis nos Relatórios por secretaria.
- [x] Separar a Carta de Serviços por secretaria.
- [x] Validar todas as páginas e publicar novo checkpoint.


## Ajustes solicitados no menu, relatórios e Carta de Serviços
- [x] Trocar o ícone do Cadastrar pedido SIC para o sinal de +.
- [x] Remover Metas e prazos e Dicionário de indicadores do menu e suas rotas acessíveis.
- [x] Renomear Secretarias oficiais para Secretarias.
- [x] Remover o título Fontes e orientação.
- [x] Garantir que Relatórios por secretaria liste todas as secretarias disponíveis.
- [x] Melhorar a Carta de Serviços com serviços individualizados, campos legíveis e navegação por serviço.
- [x] Validar todas as mudanças em desktop e mobile e salvar checkpoint.


## Nova Carta de Serviços ao Usuário
- [x] Estruturar o conteúdo anexado por secretaria, setor e serviço.
- [x] Criar página própria com busca, filtro por secretaria e cartões detalhados.
- [x] Adicionar a Carta de Serviços ao menu da aplicação.
- [x] Preservar o aviso de versão inicial e validação pelos órgãos responsáveis.
- [x] Validar conteúdo, busca, filtros e responsividade.
- [ ] Salvar checkpoint publicado.


## Nova ordem da página institucional
- [x] Ordenar seções: canais, manifestações, três banners, SIC, protocolos/LGPD, Nossa Equipe, documentos e base legal.
- [x] Destacar o responsável pelos dados pessoais como DPO no bloco Protocolos, sigilo e LGPD.
- [x] Renomear Equipe da Ouvidoria para Nossa Equipe.
- [x] Destacar a nota de acessibilidade e fonte no final da página.
- [x] Validar e publicar novo checkpoint.

## SIC, Ouvidoria institucional e configurações

## Banners de acolhimento e inclusão
- [x] Adicionar banner de combate à discriminação racial.
- [x] Adicionar banner de atendimento à pessoa com deficiência.
- [x] Manter o banner de Denúncia de Violência contra Mulheres e organizar os três juntos.
- [x] Validar a página institucional e publicar novo checkpoint.

## Fluxo federal do SIC e conclusão da Ouvidoria
- [x] Adicionar área inicial com Fazer pedido e Ver meus pedidos.
- [x] Adicionar escolha entre informação pública, pessoal e de outra pessoa.
- [x] Adicionar órgão/secretaria de destino obrigatório com busca/lista.
- [x] Adicionar descrição do pedido com contador até 8.000 caracteres.
- [x] Adicionar anexos com formatos permitidos e limite de 30 MB por arquivo.
- [x] Adicionar resumo do pedido antes do envio e tela de conclusão.
- [x] Completar a página de registro da Ouvidoria com resumo, anexos e conclusão.
- [x] Validar os dois fluxos e publicar novo checkpoint.

## Simplificação solicitada do SIC
- [x] Remover da página SIC os blocos Base legal e proteção de dados, Tipos de informação, Identificação é opcional e Canais e responsáveis.
- [x] Manter somente o formulário de cadastro do pedido em uma única página.
- [x] Manter identificação opcional no final do formulário.
- [x] Validar e publicar a página simplificada.

## Correção da estrutura do SIC
- [x] Manter o SIC em rota/página separada da Ouvidoria.
- [x] Exibir todas as solicitações do cadastro na mesma página.
- [x] Remover etapas numeradas e qualquer botão Avançar/Continuar.
- [x] Manter identificação opcional somente no final do formulário.
- [x] Validar o formulário contínuo em desktop e mobile e salvar checkpoint.

## Ampliação solicitada
- [x] Reunir todo o conteúdo oficial disponível para a página Informações da Ouvidoria.
- [x] Transformar Cadastro do SIC em página institucional completa, sem fluxo fragmentado.
- [x] Incluir no SIC canais, finalidade, categorias, prazos, recursos, identificação opcional, sigilo, LGPD, responsáveis e base legal.
- [x] Validar as duas páginas em desktop e mobile e salvar novo checkpoint.

- [x] Consultar a página oficial da Ouvidoria de Itupeva.
- [x] Criar página Cadastro do SIC conforme a LAI.
- [x] Adicionar Cadastro do SIC ao menu.
- [x] Criar página institucional da Ouvidoria baseada na referência oficial.
- [x] Criar página Configurações e mover o aviso da fonte local para ela.
- [x] Remover as colunas fixas de status e fazer os filtros controlarem os dados exibidos.
- [x] Validar rotas, formulário e responsividade.
- [ ] Salvar checkpoint.


## Filtros de status

- [ ] Padronizar opções: Concluídos, Abertos e Registrados.
- [ ] Usar Registrados como seleção padrão.
- [ ] Alterar o padrão inicial da Evolução dos registros para Registrados.
- [ ] Validar interação e salvar checkpoint.


## Secretarias e assuntos ampliados

- [ ] Permitir rolagem no bloco de Desempenho por secretaria.
- [ ] Exibir Concluídos, Abertos e Registrados por secretaria.
- [ ] Permitir rolagem no bloco de Assuntos.
- [ ] Exibir Concluídos, Abertos e Registrados por assunto.
- [ ] Calcular os três status usando o mesmo período selecionado.
- [ ] Validar desktop e mobile e salvar checkpoint.


## Correção da contagem de assuntos

- [ ] Comparar soma dos assuntos com protocolos registrados no mesmo período.
- [ ] Corrigir o índice dos assuntos entre meses e períodos.
- [ ] Não exibir soma de assuntos maior que o total de protocolos.
- [ ] Validar períodos de 12 meses, 6 meses, mês e personalizado.
- [ ] Salvar checkpoint.


## Dentro do prazo — proxy transparente

- [ ] Calcular concluídos sem prorrogação ÷ concluídos.
- [ ] Aplicar o cálculo ao fallback e ao upload local do XLSX.
- [ ] Exibir o rótulo “Sem prorrogação” no card.
- [ ] Informar que o valor não substitui o SLA oficial.
- [ ] Validar e salvar checkpoint.


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
