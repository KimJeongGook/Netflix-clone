import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Input, Button, Modal } from "components";
import './Login.css'

const Login = () =>{
    const [id, setId] = useState('')
    const [passwrod, setPassword] = useState('')
    //모달창
    const [open, setOpen] = useState(false)
    const navigator = useNavigate()

    const handleChange = (e) => {
        const {name, value} = e.target
        name === 'id' ? setId(value) : setPassword(value)
        console.log(name, value)
    }
    const isNotValid = (user) => {
        console.log(user)
        return user.id === '' || user.passwrod === ''
    }

    const handleLogin =()=>{
        //사용자 정보가 있으니까 불러오기
        const user = JSON.parse(sessionStorage.getItem('user'))
        if(!isNotValid(user)&&(id === user.id && passwrod === user.passwrod)){
            navigator('/home')
        }else{
            // alert('You gaved wrong id or password !')
            openModal()
        }
    }
    const openModal = () => {
        setOpen(true)
    }
    const closeModal = () => {
        setOpen(false)
    }
    return (
        <div className='login-container'>
            <Input name='id' type='text' placeholder='Type ID ...' value={id} 
                onChange={handleChange}/><br/>
            <Input name='passwrod' type='password' placeholder='Type PASSWORD ...' 
                value={passwrod} onChange={handleChange}/>
            <Button handleClick={handleLogin}>Login</Button>

            {/* 모달창 */}
            <Modal open={open}>
                <div className="header">-- Warning message --</div>
                <div className="body">
                    You gaved wrong id or password !
                </div>
                <div className="footer">
                    <Button size="small" handleClick={closeModal}>Close</Button>
                </div>
            </Modal>
        </div>
    )
}
export default Login;