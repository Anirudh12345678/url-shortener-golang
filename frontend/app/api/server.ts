import {NextApiRequest, NextApiResponse} from "next"

export default async function GET(req: NextApiRequest, res: NextApiResponse){
	if(req.method ==='POST'){
		console.log("In method")
		const url = req.body.url
		const result = await fetch("localhost:8080/shorten", {
			method: "POST",
			body: JSON.stringify({url: url})
		})
		const response = await result.json()
		res.status(200).json({url: response.url})
	}
	if(req.method==='GET'){
		res.status(200).send("Hello")
	} 
	else{
		res.status(404).json({message: "Not Allowed"})
	}
}

