const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/", (req, res)=>{
    res.status(200).json({
        success:true,
        message:"Server running successfully",
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});