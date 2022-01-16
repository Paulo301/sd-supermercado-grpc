const PROTO_PATH = __dirname + '/supermercado.proto';

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

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

const supermercadoService = protoDescriptor.SupermercadoService;

const server = new grpc.Server();

const bdProdutos = [
  {
    id: 0,
    nome: "Pão",
    preco: 4
  },
  {
    id: 1,
    nome: "Suco",
    preco: 5
  },
  {
    id: 2,
    nome: "Arroz",
    preco: 20.50
  },
  {
    id: 3,
    nome: "Feijão",
    preco: 9.90
  },
  {
    id: 4,
    nome: "Farinha de trigo",
    preco: 3.15
  }
];
let carrinho = [];
let pedidos = [];

server.addService(supermercadoService.service, {
  ListarProdutos: (call, callback) => {
    callback(null, { produtos: bdProdutos });
  },
  AdicionarCarrinho: (call, callback) => {
    const dados = call.request;
    const tempProduto = bdProdutos.find((produto) => produto.id === Number(dados.id));
    if(tempProduto){
      const tam = carrinho.length;
      carrinho.push(
        {
          idCarrinho: tam ? carrinho[tam - 1].idCarrinho + 1 : 0,
          produto: tempProduto,
          quantidade: Number(dados.quantidade)
        }
      );
      callback(null, { mensagem: "Produto adicionado com sucesso!\n" });
    } else{
      callback(null, { mensagem: "Id inválida\n" });
    }
  },
  RemoverCarrinho: (call, callback) => {
    const dados = call.request;

    const tempProduto2 = carrinho.find((produto) => produto.idCarrinho === Number(dados.id));
    if(tempProduto2){
      const tempCarrinho = carrinho.filter((produto) => produto.idCarrinho !== Number(dados.id));
      carrinho = tempCarrinho;
      callback(null, { mensagem: "Produto removido com sucesso\n" });
    } else {
      callback(null, { mensagem: "Id inválida\n" });
    }
  },
  ListarCarrinho: (call, callback) => {
    callback(null, { itensCarrinho: carrinho });
  },
  Pagar: (call, callback) => {
    if(carrinho.length){
      const tam = pedidos.length;
      pedidos.push(
        {
          idPedido: tam ? pedidos[tam - 1].idPedido + 1 : 0,
          produtos: carrinho.map((produto) => {
            const {idCarrinho, ...resto} = produto;
            return {...resto};
          }),
          status: "Pago"
        }
      );
      carrinho = [];
      callback(null, { mensagem: "Pedido pago com sucesso!\n" });
    } else {
      callback(null, { mensagem: "O carrinho está vazio\n" });
    }
  },
  SolicitarEntrega: (call, callback) => {
    const dados = call.request;

    const tempPedido = pedidos.find((pedido) => pedido.idPedido === Number(dados.id));
    if(tempPedido){
      const tempPedidos = pedidos.map((pedido) => {
        if(pedido.idPedido === Number(dados.id)){
          return {...pedido, status: "Entrega solicitada"}
        } else{
          return pedido;
        }
      });
      pedidos = tempPedidos;
      callback(null, { mensagem: "Entrega solicitada com sucesso\n" });
    } else {
      callback(null, { mensagem: "Id inválida\n" });
    }
  },
  ListarPedidos: (call, callback) => {
    callback(null, { pedidos: pedidos });
  }
});

server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (error, port) => {
    console.log("Servidor gRPC rodando!");
    server.start();
});