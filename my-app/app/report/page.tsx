'use client'

import { useState } from "react"
import axios from "axios"

function Report() {

    const [file, setFile] = useState<File | null>(null)


    async function handleFile() {
        if (!file) {
            return
        }

        const form = new FormData()
        form.append("file", file)

        try {
            console.log("teste")
            const response = await axios.post(
                "http://localhost:3003/reports/validation",
                form,
                {
                    headers: {
                    "Content-Type": "multipart/form-data",
                    },
                }
            )

            return

        } catch (e) {
            console.error(e)
        }

    }

    return (
        <form action={handleFile} className="flex flex-col">
            <input
                type="file"
                id="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <button
                type="submit"
                className="p-4 border"
            >
                Submit
            </button>
        </form>
    )
}

export default Report