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

// The protoDescriptor object has the full package hierarchy
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

// implementação do serviço
server.addService(supermercadoService.service, {
  // AdicionarPizza: (call, callback) => {
  //   const pizza = call.request;
  //   bd.cardapio.push(pizza);

  //   callback(null, {});
  // },

  // ListarPizzas: (call, callback) => {
  //     callback(null, { pizzas: bd.cardapio });
  // },

  // RealizarPedido: (call, callback) => {
  //   const pedido = call.request;
  //   const valorTotal = pedido.pizza.preco * pedido.quantidade;

  //   bd.pedidos.push(pedido);

  //   callback(null, { valorTotal });
  // },

  ListarProdutos: (call, callback) => {
    callback(null, { produtos: bdProdutos });
  },
  AdicionarCarrinho: (call, callback) => {
    const pizza = call.request;
    bd.cardapio.push(pizza);

    callback(null, {});
  },
  RemoverCarrinho: (call, callback) => {
    callback(null, { pedidos: bd.pedidos });
  },
  ListarCarrinho: (call, callback) => {
    callback(null, { itensCarrinho: carrinho });
  },
  Pagar: (call, callback) => {
    callback(null, { pedidos: bd.pedidos });
  },
  SolicitarEntrega: (call, callback) => {
    callback(null, { pedidos: bd.pedidos });
  },
  ListarPedidos: (call, callback) => {
    callback(null, { pedidos: pedidos });
  }
});

server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (error, port) => {
    console.log("Servidor gRPC rodando!");
    server.start();
});