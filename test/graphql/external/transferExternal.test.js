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


        it('Testando a regra relacionada a transferência com sucesso quando envio valores válidos', async () => {
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

   

    const testesDeErrosDeNegocio = require('../fixture/requisicoes/transferencia/createTransferWithError.json')
        testesDeErrosDeNegocio.forEach(teste => {
            it(`Testando a regra relacionada a ${teste.nomeDoTeste}`, async () => {

                const respostaTransferencia = await request(process.env.BASE_URL_GRAPHQL)
                    .post('')
                    .set('Authorization', `Bearer ${token}`)
                    .send(teste.createTransfer);
                
                expect(respostaTransferencia.status).to.equal(200);
                expect(respostaTransferencia.body.errors[0].message).to.equal(teste.mensagemEsperada);
            });

        })



            it('Testando a regra relacionada a token de autenticação não informado', async () => {
                const respostaTransferencia = await request(process.env.BASE_URL_GRAPHQL)
                    .post('')
                    .send(createTransfer);
                
                expect(respostaTransferencia.status).to.equal(200);
                expect(respostaTransferencia.body.errors[0]).to.have.property('message', 'Autenticação obrigatória');
            });

        });  
    });
