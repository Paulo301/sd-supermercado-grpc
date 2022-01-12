const PROTO_PATH = __dirname + '/supermercado.proto';

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
);

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).supermercado;

const client = new protoDescriptor.PizzaService("127.0.0.1:50051", grpc.credentials.createInsecure());
let isInMenu = true;
let menuOption = "";

rl.on('line', line => {
  if(isInMenu){
    menuOption = line.trim();
    isInMenu = false;
    if(line.trim()==="1"){
      client.ListarProdutos({}, (err, result) => {
        if (err) {
          console.log("Erro: " + err);
        } else {
          const { produtos } = result;
      
          let mensagem = "";
      
          produtos.forEach((produto) => {
            mensagem += `Id: ${produto.id} \nNome: ${produto.nome} \nPreço: ${produto.preco}\n\n`;
          });
          console.log(mensagem);
        }
      });
    } else if(line.trim()==="2"){
      console.log("Digite a id do produto e a quantidade dele, separadas por virgula: Ex: 1, 3");
    } else if(line.trim()==="3"){
      console.log("Digite a id do produto a ser removido do carrinho");
    } else if(line.trim()==="4"){
      client.ListarCarrinho({}, (err, result) => {
        if (err) {
          console.log("Erro: " + err);
        } else {
          const { itensCarrinho } = result;
          let mensagem2 = "";
          let total = 0;

          itensCarrinho.forEach((produto) => {
            mensagem2 += 
              `IdCarrinho: ${produto.idCarrinho} \n`+
              `Produto: \n${`>>id: ${produto.produto.id} \n>>nome: ${produto.produto.nome} \n>>preço: ${produto.produto.preco}\n`}`+
              `Quantidade: ${produto.quantidade}\n\n`
            ;
            total += produto.produto.preco*produto.quantidade;
          });

          mensagem2 += `Total: ${total} \n`;

          if(carrinho.length === 0){
            mensagem2 = "Carrinho vazio\n"
          }
          console.log(mensagem2);
        }
      });
    } else if(line.trim()==="5"){
      socket.write("Pagar");
    } else if(line.trim()==="6"){
      console.log("Digite a id do pedido para solicitar a entrega");
    } else if(line.trim()==="7"){
      client.ListarCarrinho({}, (err, result) => {
        if (err) {
          console.log("Erro: " + err);
        } else {
          const { pedidos } = result;
          let mensagem3 = "";

          pedidos.forEach((pedido) => {
            let tempProdutos = "";
            let total = 0;
            pedido.produtos.forEach((produto, index) => {
              tempProdutos += 
                `>Produto ${index+1}: \n${`>>id: ${produto.produto.id} \n>>nome: ${produto.produto.nome} \n>>preço: ${produto.produto.preco}\n`}`+
                `>Quantidade: ${produto.quantidade}\n`
              ;
              total += produto.produto.preco*produto.quantidade;
            });
            mensagem3 += 
              `IdPedido: ${pedido.idPedido} \n\n`+
              `Produtos: \n${tempProdutos}\n`+
              `Total: ${total}\n`+
              `Status: ${pedido.status}\n\n`
            ;
          });

          if(pedidos.length === 0){
            mensagem3 = "Sem pedidos registrados\n"
          }
          console.log(mensagem3);
        }
      });
    } else {
      menuOption = "";
      isInMenu = true;
      console.log("Você digitou uma opção inválida");
    }
  } else {
    if(menuOption==="2"){
      socket.write("Adicionar_Carrinho,"+line);
    } else if(menuOption==="3"){
      socket.write("Remover_Carrinho,"+line);
    } else if(menuOption==="6"){
      socket.write("Solicitar_Entrega,"+line);
    }
  }
});

// client.AdicionarPizza({
//     "id": 1,
//     "nome": "Calabresa",
//     "descricao": "Descrição da calabresa",
//     "preco": 14
//   }, (err, result) => {
//     if (err) {
//         console.log("Erro: " + err);
//     } else {
//         console.log("Pizza cadastrada com sucesso!");
//     }
//   });

//   client.AdicionarPizza({
//     "id": 2,
//     "nome": "Nordestina",
//     "descricao": "Pizza de carne de sol e manteiga de garrafa",
//     "preco": 20
//   }, (err, result) => {
//     if (err) {
//         console.log("Erro: " + err);
//     } else {
//         console.log("Pizza cadastrada com sucesso!");
//     }
//   });

// client.ListarPizzas({}, (err, result) => {
//   if (err) {
//       console.log("Erro: " + err);
//   } else {
//       console.log("Cardápio:");

//       const { pizzas } = result;

//       for (let i = 0; i < pizzas.length; i++) {
//           console.log("- Pizza:");
//           console.log(pizzas[i]);
//       }
//   }
// });