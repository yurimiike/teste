import express from 'express';
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());

let lista_usuarios = []
let contador = 0
let contadorRecado = 0 

function adicionarTeste(){
    const novoUsuario = {
        id: ++contador,
        nome: "Main Jett Desde o Beta",
        email: "sojogovalorant@riot.com.br",
        senha: "exemplodesenha",
        recados: [{
                  id: ++contador,
                 titulo: "É us guri pae",
                 descricao:"Bah, né meo. Tá loko?!"
                }]
    }
    lista_usuarios.push(novoUsuario)
}
adicionarTeste()

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
  return response.status(201).json("Usuário cadastrado com sucesso")
});

app.post('/login', async (request, response) => {
  const infoRequest = request.body

  if (infoRequest.email === undefined || infoRequest.email === "") {
    return response.status(400).json("Dados incorretos")
  }

  if (infoRequest.senha === undefined || infoRequest.senha === "") {
    return response.status(400).json("Dados incorretos")
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

app.get('/listar-todos-usuarios', (request, response) => {
    return response.json(lista_usuarios);
    
});

app.get('/visualizar-usuario', (request, response) => {
  const parametros = request.query


  if (parametros.id === undefined || parametros.id === "") {
    return response.status(400).json("Informe um id válido")
  }

  let usuario = lista_usuarios.find(usuario => usuario.id == parametros.id)

  if (!usuario){
    return response.status(400).json("Usuário não encontrado")
  }

  return response.json(usuario);
});

app.put('/alterar-usuario', async (request, response) => {
  const infoRequest = request.body

  if (infoRequest.id === undefined || infoRequest.id === "") {
    return response.status(400).json("Dados incorretos")
  }

  if (infoRequest.nome === undefined || infoRequest.nome === "") {
    return response.status(400).json("Dados incorretos")
  }

  if (infoRequest.email === undefined || infoRequest.email === "") {
    return response.status(400).json("Dados incorretos")
  }

  if (infoRequest.senha === undefined || infoRequest.senha === "") {
    return response.status(400).json("Dados incorretos")
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
    return response.status(400).json("Usuário não encontrado")
  }

  lista_usuarios[index] = usuario_alterarado
  return response.status(201).json("Usuário alterarado com sucesso")
});

app.delete('/deletar-usuario/', (request, response) => {
  const parametros = request.query
  const idUsuario= parametros.id_usuario
  let usuario = lista_usuarios.find(usuario => usuario.id == idUsuario)
  
  if (!usuario){
     return response.status(400).json("Usuário não encontrado")
  }
  
  lista_usuarios = lista_usuarios.filter(usuario => usuario.id != idUsuario)
  return response.status(200).json("Usuario excluído com sucesso")
});

app.delete('/deletar-recado/', (request, response) => {
  const parametros = request.query
  const idRecado = parametros.id_recado
  const idUsuario= parametros.id_usuario
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
  
  return response.status(201).json('O recado foi adicionado com sucesso' )
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
    return response.status(400).json("Dados incorretos")
  }

  if (infoRequest.id_recado === undefined || infoRequest.id_recado === "") {
    return response.status(400).json("Dados incorretos")
  }

  if (infoRequest.titulo === undefined || infoRequest.titulo === "") {
    return response.status(400).json("Dados incorretos")
  }

  if (infoRequest.descricao === undefined || infoRequest.descricao === "") {
    return response.status(400).json("Dados incorretos")
  }
  
  const recado_modificado = {
    id: infoRequest.id_recado,
    titulo: infoRequest.titulo,
    descricao: infoRequest.descricao,
  }
  
  let usuario = lista_usuarios.find(usuario => usuario.id == infoRequest.id_usuario)
  if (!usuario){
    return response.status(400).json("Usuario não encontrado")
  }

 let index = usuario.recados.findIndex(recado => recado.id == infoRequest.id_recado)
  if (index === -1){
    return response.status(400).json("Recado não encontrado")
  }

  usuario.recados[index] = recado_modificado
  return response.status(201).json("Recado alterarado com sucesso")
});

app.listen(8080, () => console.log("Recadinhos Funcionandinho"));