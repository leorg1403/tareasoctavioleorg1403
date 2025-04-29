async function main() {
    const response = await fetch('http://localhost:3000/api/hello/Santino')

    const message = await response.json()

    console.log(response)
    console.log(message)

    const data = {
        id: 1,
        name: "sword",
        effect: "Deals damage"
    }

    const response_r = await fetch('http://localhost:3000/api/receive_data',{
        method: "POST",
        headers: {'Content-Type': 'application/json'}
    })
}

main()