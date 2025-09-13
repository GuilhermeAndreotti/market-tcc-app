

## Sobre o projeto

O objetivo desse projeto é apresentar um protótipo simplificado de umsistema web focado para revendedoras de veículos, com o foco de centralizar as publicações em um sistema só. Além disso também é possível publicar os veículos cadastrados como anúncios no Mercado Livre, no [setor de veículos](https://www.mercadolivre.com.br/c/carros-motos-e-outros), através da integração com o Mercado Livre. O sistema web utilizou React e a UI do [Ant Design](https://ant.design/) para seu desenvolvimento.

O diagrama de componentes ilustra a interação realizada com a API do Mercado Livre e o sistema durante o fluxo de publicação:

<div align="center">
  <img width="713" height="450" alt="image" src="https://github.com/user-attachments/assets/1e192c47-423b-42d8-ab72-4fdcc731a4b3" />
</div>

## Integração

A integração é realizado pelo admin master, que nessa tela, poderia se conectar com a conta do Mercado Livre. Após isso, o mesmo podendo remover quando necessário.

<div align="center">
  <img width="1298" height="398" alt="image" src="https://github.com/user-attachments/assets/dd549f64-05a2-4c1b-884f-a98b6e6d2925" />
</div>

## Instalação

Rode yarn para instalar as dependências, se não tiver o yarn, rode o primeiro comando antes:

```bash
npm install --global yarn
```

```bash
$ yarn
```

Após isso, é necessário preencher o env do front, que é

```env
REACT_APP_API_KEY=
REACT_APP_ADMIN_ID=4ab2601e-34fa-4718-beda-1f788077c9f2
REACT_APP_REDIRECT_URL=
REACT_APP_MERCADO_LIVRE_URL=
```

REACT_APP_API_KEY pode ser preenchido http://localhost:3000, por exemplo, por ser a url da API. REACT_APP_ADMIN_ID está com 4ab2601e-34fa-4718-beda-1f788077c9f2 por ser o login padrão do primeiro master.

Por fim, para rodar o projeto, execute:

```bash
yarn run start
```

## Documentaçôes utilizadas

- https://ant.design/
- https://react.dev/
