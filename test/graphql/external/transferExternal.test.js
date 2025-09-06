// Bibliotecas
const request = require('supertest');
const { expect,use } = require('chai');

const chaiExclude = require('chai-exclude');
use(chaiExclude);
require('dotenv').config();


// Testes
describe('Transfer', () => {
    let token

    describe('Mutation Transfer - GraphQL', () => {
        //com base no nosso contexto atual, que roda todos os testes em 54ms, se fosse mais que 1h, teria que ser um beforeEach
        before(async () => {
            const loginUser = require('../fixture/requisicoes/login/loginUser.json')
            const respostaLogin = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .send(loginUser);
            //console.log(respostaLogin.body.data.loginUser.token)

            token = respostaLogin.body.data.loginUser.token;
        });

        beforeEach(() => {
            createTransfer = require('../fixture/requisicoes/transferencia/createTransfer.json')
        })


        it('a) Validar transferência com sucesso quando envio valores válidos', async () => {
            const respostaEsperada = require('../fixture/respostas/transferencia/transferData.json')

            const respostaTransferencia = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send(createTransfer);
            
            expect(respostaTransferencia.status).to.equal(200);
            expect(respostaTransferencia.body.data.createTransfer)
                .excluding('date')
                .to.deep.equal(respostaEsperada.data.createTransfer)
        });

        it('b) Validar saldo indisponível para transferência', async () => {
            createTransfer.variables.value = 10000.01;

            const respostaTransferencia = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send(createTransfer);
            
            expect(respostaTransferencia.status).to.equal(200);
            expect(respostaTransferencia.body.errors[0]).to.have.property('message', 'Saldo insuficiente');
        });

        it('c) Validar mensagem de token de autenticação não informado', async () => {
            const respostaTransferencia = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .send(createTransfer);
            
            expect(respostaTransferencia.status).to.equal(200);
            expect(respostaTransferencia.body.errors[0]).to.have.property('message', 'Autenticação obrigatória');
        });


        it('d) Validar tentativa de transferencia de valor acima de 5k para usuário não favorecido', async () => {
                createTransfer.variables.value = 5001
                createTransfer.variables.to = "julio"
                const resposta = await request(process.env.BASE_URL_GRAPHQL)
                    .post('')
                    .set('Authorization', `Bearer ${token}`)
                    .send(createTransfer);
            
                expect(resposta.status).to.equal(200);
              //  console.log(resposta.body)
                expect(resposta.body.errors[0]).to.have.property('message', 'Transferência acima de R$ 5.000,00 só para favorecidos');
        });

        it('e) Validar tentativa de transferencia com remetente não encontrado', async () => {
            createTransfer.variables.from = "pedro"
             const resposta = await request(process.env.BASE_URL_GRAPHQL)
                    .post('')
                    .set('Authorization', `Bearer ${token}`)
                    .send(createTransfer);
            
             expect(resposta.status).to.equal(200);
             //console.log(resposta.body)
             expect(resposta.body.errors[0]).to.have.property('message', 'Usuário remetente ou destinatário não encontrado');
        });


         it('f) Validar tentativa de transferencia para destinatario não encontrado', async () => {
            createTransfer.variables.to = "joao"
            const resposta = await request(process.env.BASE_URL_GRAPHQL)
                .post('')
                .set('Authorization', `Bearer ${token}`)
                .send(createTransfer);
            
             expect(resposta.status).to.equal(200);
             expect(resposta.body.errors[0].message).to.equal('Usuário remetente ou destinatário não encontrado');
         });
         });  
    });
