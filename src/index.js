import express from 'express';
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());

let lista_usuarios = [
    [
        {
            id: 9999,
            nome: "Main Reyna",
            email: "souplatina@gmail.com",
            senha: "NãOaBr0ObOmB",
            recados: [ {
                id: 777,
                titulo: "Dropa Aí Men",
                descricao:"To sem dinheiro, compra pra mim?"
              }]
        },
        {
            id: 9998,
            nome: "Suporte de Dano",
            email: "naowardo@bol.com.br",
            senha: "opspegueiseufarm",
            recados: [ {
                id: 666,
                titulo: "Lembrete",
                descricao:"Comprar Capuz da Morte de Rabadon"
              }]
        },
        {
            id: 9997,
            nome: "Uh Tal Du Ak TrOvÃo",
            email: "cs.css.cs@cs.valve.com",
            senha: "123456",
            recados: [ {
                id: 555,
                titulo: "É us guri pae",
                descricao:"Bah, né meo. Tá loko?!"
              }]
        }
      ]
]
let contador = 0
let contadorRecado = 0 

app.post('/adicionar-usuario', async (request, response) => {
  const infoRequest = request.body

  if (infoRequest.nome === undefined || infoRequest.nome === "") {
    return response.status(400).json("Informe um nome válido")
  }

  if (infoRequest.email === undefined || infoRequest.email === "") {
    return response.status(400).json("Informe um email válido")
  }

  if (infoRequest.senha === undefined || infoRequest.senha === "") {
    return response.status(400).json("Informe uma senha válida")
  }

  let usuario = lista_usuarios.find(item => item.email == infoRequest.email)
  if (usuario){
    return response.status(400).json("Email já cadastrado")
  }

  const hashedpassword = await bcrypt.hash(infoRequest.senha, 6);

  const novoUsuario = {
      id: ++contador,
      nome: infoRequest.nome,
      email: infoRequest.email,
      senha: hashedpassword,
      recados: []
  }
  
  lista_usuarios.push(novoUsuario)
  return response.status(201).json("Usuário adicionado com sucesso")
});

app.post('/login', async (request, response) => {
  const infoRequest = request.body

  if (infoRequest.email === undefined || infoRequest.email === "") {
    return response.status(400).json("Informe um email válido")
  }

  if (infoRequest.senha === undefined || infoRequest.senha === "") {
    return response.status(400).json("Informe uma senha válida")
  }

  let usuario = lista_usuarios.find(usuario => usuario.email == infoRequest.email)
  if (!usuario) { 
    return response.status(400).json("Dados incorretos")
  }

  const senhaCorreta = await bcrypt.compare(
    infoRequest.senha,
    usuario.senha
  )

  if (!senhaCorreta){
    return response.status(400).json("Dados incorretos")
  }
  
  return response.status(201).json("Usuário logado")
});

//lembrar de mexer nessa parte aqui 
app.get('/listar-usuario', (request, response) => {
    return response.json(lista_usuarios);
    
});

app.get('/visualizar-usuario', (request, response) => {
  const parametros = request.query

  let usuario = lista_usuarios.find(usuario => usuario.id == parametros.id)
  if (!usuario){
    return response.status(400).json("Usuário não encontrado")
  }

  return response.json(usuario);
  
});




//aqui a gente vai pegar o id e mudar alguma coisa nele
app.put('/alterar-usuario', async (request, response) => {
  const infoRequest = request.body

  if (infoRequest.id === undefined || infoRequest.id === "") {
    return response.status(400).json("Informe um id correto")
  }

  if (infoRequest.nome === undefined || infoRequest.nome === "") {
    return response.status(400).json("Informe um nome válido")
  }

  if (infoRequest.email === undefined || infoRequest.email === "") {
    return response.status(400).json("Informe um email válido")
  }

  if (infoRequest.senha === undefined || infoRequest.senha === "") {
    return response.status(400).json("Informe uma senha válida")
  }

  
  const hashedpassword = await bcrypt.hash(infoRequest.senha, 6);

  const usuario_alterarado = {
      id: infoRequest.id,
      nome: infoRequest.nome,
      email: infoRequest.email,
      senha: hashedpassword,
      recados: []
  }

  let index = lista_usuarios.findIndex(usuario => usuario.id == infoRequest.id)
  if (index === -1){
    return response.status(400).json("mudar a mensagem")
  }

  lista_usuarios[index] = usuario_alterarado
  return response.status(201).json("Usuário alterarado com sucesso")
});







//aqui a gente vai deletar, né, não seja burro tbm
app.delete('/deletar-usuario/', (request, response) => {
  const parametros = request.query
  const idUsuario= parametros.id_usuario
  // let idUsuario = idRecado <= talvez devesse validar a hash aqui, não sei, vou ver e te aviso. 
  let usuario = lista_usuarios.find(usuario => usuario.id == idUsuario)
  
  if (!usuario){
     return response.status(400).json("Usuário inválido")
  }
  
  lista_usuarios = lista_usuarios.filter(usuario => usuario.id != idUsuario)
  return response.status(200).json('Usuario excluído com sucesso')
});


  







//--------------------------------------------RECADO----------------------------------------------------
//--------------------------------------------RECADO----------------------------------------------------
//--------------------------------------------RECADO----------------------------------------------------
//--------------------------------------------RECADO----------------------------------------------------
//--------------------------------------------RECADO----------------------------------------------------
//--------------------------------------------RECADO----------------------------------------------------
//--------------------------------------------RECADO----------------------------------------------------



//aqui a gente vai deletar, né, não seja burro tbm
app.delete('/deletar-recado/', (request, response) => {
  const parametros = request.query
  const idRecado = parametros.id_recado
  const idUsuario= parametros.id_usuario
  // let idUsuario = idRecado <= talvez devesse validar a hash aqui, não sei, vou ver e te aviso. 
  let usuario = lista_usuarios.find(usuario => usuario.id == idUsuario)

  if (!usuario){
     return response.status(400).json("Usuário inválido")
  }

  let indexRecado = usuario.recados.findIndex(recado => recado.id == idRecado)

  if (indexRecado === -1) {
      return response.status(400).json("Recado não encontrado")
  }
  
  usuario.recados = usuario.recados.filter(recado => recado.id != idRecado)
  return response.status(200).json('Recado excluído com sucesso')
});


app.get('/recados', (request, response) => {
  return response.json('PODE CONFERIR NO POSTMAN, SE TÁ LÁ, TÁ FUNCIONANDO, PARÇA! :)');

});


app.post('/adicionar-recado', (request, response) => {
  const infoRequest = request.body

  if (infoRequest.id_usuario === undefined || infoRequest.id_usuario === "") {
    return response.status(400).json("Informe um id correto")
  }

  if (infoRequest.titulo === undefined || infoRequest.titulo === "") {
    return response.status(400).json("Informe um nome válido")
  }

  if (infoRequest.descricao === undefined || infoRequest.descricao === "") {
    return response.status(400).json("Informe um email válido")
  }

  let usuario = lista_usuarios.find(usuario => usuario.id == infoRequest.id_usuario)
  if (!usuario){
     return response.status(400).json("Usuário inválido")
  }

  const novoRecado = {
      id: ++contadorRecado,
      titulo: infoRequest.titulo,
      descricao: infoRequest.descricao,
     
  }
  
  usuario.recados.push(novoRecado)
  // console.log ('O recado "'+ novoRecado.descricao +'" foi adicionado com sucesso')
  return response.status(201).json('O recado "'+ novoRecado.descricao +'" foi adicionado com sucesso' )
});

app.get('/listar-recado/:id?', (request, response) => {
  const parametros = request.query
  
  let usuario = lista_usuarios.find(item => item.id == parametros.id)
  if (usuario !== undefined){
    return response.status(201).json(usuario.recados)
  } else {
    return response.status(201).json(parametros.id)
  }
});

app.get('/visualizar-recado', (request, response) => {
  const parametros = request.query

  let usuario = lista_usuarios.find(usuario => usuario.id == parametros.id_usuario)
  if (!usuario){
    return response.status(400).json("Recado não encontrado")
  }
  let recado = usuario.recados.find(recado => recado.id == parametros.id_recado)
  if (!recado){
    return response.status(400).json("Recado não encontrado")
  }

  return response.json(recado);
  
});

app.put('/alterar-recado', async (request, response) => {
  const infoRequest = request.body

  if (infoRequest.id_usuario === undefined || infoRequest.id_usuario === "") {
    return response.status(400).json("Informe um id correto")
  }

  if (infoRequest.id_recado === undefined || infoRequest.id_recado === "") {
    return response.status(400).json("Informe um id correto")
  }

  if (infoRequest.titulo === undefined || infoRequest.titulo === "") {
    return response.status(400).json("Informe um nome válido")
  }

  if (infoRequest.descricao === undefined || infoRequest.descricao === "") {
    return response.status(400).json("Informe um email válido")
  }
  
  const recado_modificado = {
    id: infoRequest.id_recado,
    titulo: infoRequest.titulo,
    descricao: infoRequest.descricao,
  }
  
  let usuario = lista_usuarios.find(usuario => usuario.id == infoRequest.id_usuario)
  if (!usuario){
    return response.status(400).json("não foi possível completar sua ligação")
  }

 let index = usuario.recados.findIndex(recado => recado.id == infoRequest.id_recado)
  if (index === -1){
    return response.status(400).json("não foi possível completar sua ligação")
  }

  usuario.recados[index] = recado_modificado
  return response.status(201).json("Recado alterarado com sucesso")
});

app.listen(8080, () => console.log("Recadinhos Funcionandinho"));