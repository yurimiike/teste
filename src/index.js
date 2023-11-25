import express from 'express';
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());

let lista_usuarios = []
let contador = 0
let contadorRecado = 0 

app.post('/trabalho-final/add-user', async (request, response) => {
  const infoRequest = request.body

  if (infoRequest.name === undefined || infoRequest.name === "") {
    return response.status(400).json("Informe um nome válido")
  }

  if (infoRequest.email === undefined || infoRequest.email === "") {
    return response.status(400).json("Informe um email válido")
  }

  if (infoRequest.password === undefined || infoRequest.password === "") {
    return response.status(400).json("Informe uma senha válida")
  }

  let user = lista_usuarios.find(item => item.email == infoRequest.email)
  if (user){
    return response.status(400).json("Email já cadastrado")
  }

  const hashedPassword = await bcrypt.hash(infoRequest.password, 6);

  const newUser = {
      id: ++contador,
      name: infoRequest.name,
      email: infoRequest.email,
      password: hashedPassword,
      recados: []
  }
  
  lista_usuarios.push(newUser)
  return response.status(201).json("Usuário adicionado com sucesso")
});

app.post('/trabalho-final/login', async (request, response) => {
  const infoRequest = request.body

  if (infoRequest.email === undefined || infoRequest.email === "") {
    return response.status(400).json("Informe um email válido")
  }

  if (infoRequest.password === undefined || infoRequest.password === "") {
    return response.status(400).json("Informe uma senha válida")
  }

  let user = lista_usuarios.find(usuario => usuario.email == infoRequest.email)
  if (!user) { 
    return response.status(400).json("Dados incorretos")
  }

  const passwordCorreto = await bcrypt.compare(
    infoRequest.password,
    user.password
  )

  if (!passwordCorreto){
    return response.status(400).json("Dados incorretos")
  }
  
  return response.status(201).json("Usuário logado")
});

//lembrar de mexer nessa parte aqui 
app.get('/trabalho-final/listar-user', (request, response) => {
    return response.json(lista_usuarios);
    
});

app.get('/trabalho-final/visualizar-user', (request, response) => {
  const parametros = request.query

  let user = lista_usuarios.find(usuario => usuario.id == parametros.id)
  if (!user){
    return response.status(400).json("Usuário não encontrado")
  }

  return response.json(user);
  
});




//aqui a gente vai pegar o id e mudar alguma coisa nele
app.put('/trabalho-final/edit-user', async (request, response) => {
  const infoRequest = request.body

  if (infoRequest.id === undefined || infoRequest.id === "") {
    return response.status(400).json("Informe um id correto")
  }

  if (infoRequest.name === undefined || infoRequest.name === "") {
    return response.status(400).json("Informe um nome válido")
  }

  if (infoRequest.email === undefined || infoRequest.email === "") {
    return response.status(400).json("Informe um email válido")
  }

  if (infoRequest.password === undefined || infoRequest.password === "") {
    return response.status(400).json("Informe uma senha válida")
  }

  
  const hashedPassword = await bcrypt.hash(infoRequest.password, 6);

  const usuario_editado = {
      id: infoRequest.id,
      name: infoRequest.name,
      email: infoRequest.email,
      password: hashedPassword,
      recados: []
  }

  let index = lista_usuarios.findIndex(usuario => usuario.id == infoRequest.id)
  if (index === -1){
    return response.status(400).json("mudar a mensagem")
  }

  lista_usuarios[index] = usuario_editado
  return response.status(201).json("Usuário editado com sucesso")
});







//aqui a gente vai deletar, né, não seja burro tbm
app.delete('/trabalho-final/delete-user/', (request, response) => {
  const parametros = request.query
  const idUser= parametros.id_user
  // let idUsuario = idRecado <= talvez devesse validar a hash aqui, não sei, vou ver e te aviso. 
  let user = lista_usuarios.find(usuario => usuario.id == idUser)
  
  if (!user){
     return response.status(400).json("Usuário inválido")
  }
  
  lista_usuarios = lista_usuarios.filter(usuario => usuario.id != idUser)
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
app.delete('/trabalho-final/delete-recado/', (request, response) => {
  const parametros = request.query
  const idRecado = parametros.id_recado
  const idUser= parametros.id_user
  // let idUsuario = idRecado <= talvez devesse validar a hash aqui, não sei, vou ver e te aviso. 
  let user = lista_usuarios.find(usuario => usuario.id == idUser)

  if (!user){
     return response.status(400).json("Usuário inválido")
  }

  let indexRecado = user.recados.findIndex(recado => recado.id == idRecado)

  if (indexRecado === -1) {
      return response.status(400).json("Recado não encontrado")
  }
  
    
  user.recados = user.recados.filter(recado => recado.id != idRecado)
  return response.status(200).json('Recado excluído com sucesso')
});


app.get('/trabalho-final/recados', (request, response) => {
  return response.json('PODE CONFERIR NO POSTMAN, SE TÁ LÁ, TÁ FUNCIONANDO, PARÇA! :)');

});


app.post('/trabalho-final/add-recado', (request, response) => {
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

  let user = lista_usuarios.find(usuario => usuario.id == infoRequest.id_usuario)
  if (!user){
     return response.status(400).json("Usuário inválido")
  }

  const newRecado = {
      id: ++contadorRecado,
      titulo: infoRequest.titulo,
      descricao: infoRequest.descricao,
     
  }
  
  user.recados.push(newRecado)
  // console.log ('O recado "'+ newRecado.descricao +'" foi adicionado com sucesso')
  return response.status(201).json('O recado "'+ newRecado.descricao +'" foi adicionado com sucesso' )
  
});

app.get('/trabalho-final/listar-recado/:id?', (request, response) => {
  const parametros = request.query
  
  let user = lista_usuarios.find(item => item.id == parametros.id)
  if (user !== undefined){
    return response.status(201).json(user.recados)
  } else {
    return response.status(201).json(parametros.id)
  }

});

app.get('/trabalho-final/visualizar-recado', (request, response) => {
  const parametros = request.query

  let user = lista_usuarios.find(usuario => usuario.id == parametros.id_user)
  if (!user){
    return response.status(400).json("Recado não encontrado")
  }
  let recado = user.recados.find(recado => recado.id == parametros.id_recado)
  if (!recado){
    return response.status(400).json("Recado não encontrado")
  }

  return response.json(recado);
  
});


app.put('/trabalho-final/edit-recado', async (request, response) => {
  const infoRequest = request.body

  if (infoRequest.id_user === undefined || infoRequest.id_user === "") {
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
  
  let usuario = lista_usuarios.find(usuario => usuario.id == infoRequest.id_user)
  if (!usuario){
    return response.status(400).json("não foi possível completar sua ligação")
  }

 let index = usuario.recados.findIndex(recado => recado.id == infoRequest.id_recado)
  if (index === -1){
    return response.status(400).json("não foi possível completar sua ligação")
  }

  usuario.recados[index] = recado_modificado
  return response.status(201).json("Recado editado com sucesso")
});











app.listen(8080, () => console.log("Recadinhos Funcionandinho"));