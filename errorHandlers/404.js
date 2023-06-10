'usestrict';

const notFound=(req,res)=>{
    res.status(404).json({
      message: `Not Found-  ${req.originalUrl} `,
    });
}
module.exports=notFound;