const mongoose=require('mongoose');
const {Schema}=mongoose;
const bcrypt=require('bcryptjs');
const UserSchema = new Schema(
    {
      name: { type: String, trim: true },
      email: { type: String, required: true, unique: true, trim: true },
      password: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );
  
  UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };
  
  UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  
  module.exports=mongoose.model('User',UserSchema);
  
// const UserSchema=new Schema({

//     name:{type:String,required:true},
//     email:{type:String,required:true},
//     password:{type:String,required:true},
//     date:{type:Date, default:Date.now}
// })

// UserSchema.methods.encryptPassword=async(password)=>{

//     const salt=await bcrypt.genSalt(10);

//     const hash=bcrypt.hash(password,salt);
//     return hash;

// };
// UserSchema.methods.matchPassword=async function(password){

//     return await bcrypt.compare(password,this.password);


// };

// module.exports=mongoose.model('User',UserSchema);