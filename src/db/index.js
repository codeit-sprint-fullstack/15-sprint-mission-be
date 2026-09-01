import mongoose from 'mongoose';

export const ConnectDB = async() => {
  try{
    await mongoose.connect(process.env.MONG_URI);
    console.log('mongDB connect');
  } catch(error){
    console.log(`mongDB fail ${error.message}`);
    //서버 종료
    process.exit(1);
  }
};