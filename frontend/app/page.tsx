"use client"
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Copy} from "lucide-react";
import React from "react";

export default function Home() {
	const [link, setLink] = React.useState("")
	const [disabled, setDisabled] = React.useState(false)
	const [btnDis, setBtnDis] = React.useState(false)
	async function shortenUrl(){
		setDisabled(true)
		const res = await fetch('/api',{
			method: 'POST',
			body: JSON.stringify({
				url: link
			})
		})
		const data = await res.json()
		console.log(data)
		setLink(data.url)
		//setDisabled(false)
		setBtnDis(false)
	}
  return (
	  <div className="w-[100%] h-[100vh] bg-black flex flex-col items-center justify-center text-white">
		<p className="text-4xl">Welcome to the URL shortener website</p>
		<p className="text-3xl">Paste the Link in the field below!</p>
		<div className="w-[800px] h-[500px] flex flex-row gap-2 items-center justify-center">
			<Input className="w-[500px] h-[50px]" type="text" placeholder="Paste the Link Here..." onChange={(e)=>{
				setLink(e.target.value)
			}}/>
		<Button disabled={btnDis} className="ml-[20px] h-[40px]" onClick={shortenUrl}>Shorten</Button>	
		</div>
		{disabled ? <div className="bg-slate-800 p-2 w-[600px] h-[60px] rounded md flex flex-row justify-between items-center">	
			<a href={link} target="_blank">{link}</a>
			<Button className="m-2" onClick={()=>navigator.clipboard.writeText(link)}>
				<Copy />
			</Button>
			</div>: null}	
	  </div>
  );
}
