
// requerimos mongoose para la base de datos
const mongoose = require('mongoose');
// requerimos bcrypt para el hasheo de la contraseña
const bcrypt = require('bcrypt');

// forma del email
const EMAIL_PATTERN = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
//longitud del email
const PASSWORD_PATTERN = /^.{8,}$/i;
// numero de algoritmos de la contraseña
// 10 es razonable tanto en seguridad como en velocidad
const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'name is required',
    minLength: [3, 'name needs at least 3 chars']
  },
  email: {
    type: String,
    required: 'email is required',
    match: [EMAIL_PATTERN, 'email is not valid'],
    unique: true
  },
  password: {
    type: String,
    required: 'password is required',
    match: [PASSWORD_PATTERN, 'password needs at least 8 chars'],
  },
  googleID: {
    type: String
  },
  image: {
    type: String,
    default: "https://res.cloudinary.com/plasoironhack/image/upload/v1644663323/ironhack/multer-example/icono-de-li%CC%81nea-perfil-usuario-si%CC%81mbolo-empleado-avatar-web-y-disen%CC%83o-ilustracio%CC%81n-signo-aislado-en-fondo-blanco-192379539_jvh06m.jpg"
  }
});

//hash del password, y funcion NO ARROW porque utilizamos el this.
userSchema.pre('save', function(next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.hash(user.password, SALT_ROUNDS)
    .then((hash) => {
      user.password = hash
      next()
    })
    .catch(err => (err))
  }else {
    next()
  }
})

//utilizamos el metodo .compare
userSchema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password)
}




const User = mongoose.model('User', userSchema);

module.exports = User;