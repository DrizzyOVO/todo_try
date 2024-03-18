import express from "express"; 
import { authenticateJwt, SECRET } from "../middleware"; 
import { Todo } from "../db"; 


const router = express.Router(); 


router.post('/todos', authenticateJwt, async (req, res) => {
    const { title } = req.body; 
    const done = false; 
    const userId = req.headers["userId"]; 

    const len = await Todo.find({ userId: userId }); 
    const length = len.length; 
    if(length == 10) {
        res.json({ message: "Todo limit reached" }); 
    } else {

        const newTodo = new Todo({ title, done, userId }); 
        await newTodo.save() 
            .then((savedTodo: any) => {
                res.status(201).json({todos: savedTodo}); 
            })
            .catch((err: any) => { 
                res.status(500).json({ error: 'Failed to create a new todo' }); 
            }); 
    }
}); 

router.get('/todos', authenticateJwt, async (req, res) => {
    const userId = req.headers["userId"]; 
    const todos = await Todo.find({ userId: userId }); 
 
        if(todos) { 
            res.json({ todos }); 
        } else { 
            res.status(403).json({ error: "Failed to retrieve todos" }); 
        }

    // arr.push(todos[0]); 
    
    // if(arr) { 
    //     res.json(todos); 
    // } else { 
    //     res.status(403).json({ error: "Failed to retrieve todos" }); 
    // }

    // Todo.find({ userId })
    // .then((todos) => {
    //     console.log(todos);
    //   res.json(todos);
    // })
    // .catch((err) => {
    //   res.status(500).json({ error: 'Failed to retrieve todos' });
    // });

}); 

router.patch('/todos/:todoId/done', async (req, res) => {
    const { todoId } = req.params;
    const userId = req.headers["userId"]; 
    const updatedTodo = await Todo.findById({ _id: todoId });    


    if(!updatedTodo){ 
        return res.status(404).json({ error: "Todo not founc" }); 
    } else { 
        if (updatedTodo.done) { 
            updatedTodo.done = false;  
        } else { 
        updatedTodo.done = true;  
        } 
        await updatedTodo.save(); 
        res.json({ updatedTodo }); 
    }

    // await Todo.findOneAndUpdate({ _id: todoId },  { done: (true) ? false : true }) 
    //     .then((updateTodo) => {
    //         if(!updateTodo) { 
    //             return res.status(404).json({ error : "Todo not found"}); 
    //         }
    //         res.json({ updateTodo }); 
    //     })
    //     .catch((err) => { 
    //         res.status(500).json({ error: 'Failed to update todo '}); 
    //     }); 
}); 


router.post("/todos/:todoId/delete", async (req, res) => {
    const { todoId } = req.params; 
    const userId = req.headers["userId"]; 

    const deleteTodo = await Todo.findByIdAndDelete({ _id: todoId });    

    if(!deleteTodo){ 
        return res.status(404).json({ error: "Todo not founc" }); 
    } else { 
        res.json({ deleteTodo }); 
    }

})

export default router; 