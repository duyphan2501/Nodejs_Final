import {create} from "zustand"
import { toast } from "react-toastify"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL
axios.defaults.withCredentials = true

const useUserStore = create(set => {
    const login = async (user) => {
        try {
            const res = await axios.post(`${API_URL}/user/login`, user)
            toast.success(res.data.message)
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message || "Failed to login")
        }
    }

    return {
        login
    }
})

export default useUserStore