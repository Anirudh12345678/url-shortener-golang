import {NextResponse} from "next/server"

export async function POST(req: Request){
	const body = await req.json()
	const link = body.url
	console.log(link)
	const response  = await fetch("http://localhost:8080/shorten", {
		method: "POST",
		body: JSON.stringify({url: link}),
		headers: {
        "Content-type": "application/json; charset=UTF-8"
		}
	})
	const data = await response.json()
	console.log(data)
	return NextResponse.json({url:data.url })
}
