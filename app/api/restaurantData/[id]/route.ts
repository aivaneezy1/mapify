import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

type Params = {id:string}
    


export const GET = async(request:NextRequest, params:Params) =>{
    const {id} =  params
    const url = 'https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary?bl_latitude=11.847676&tr_latitude=12.838442&bl_longitude=109.095887&tr_longitude=109.149359&restaurant_tagcategory_standalone=10591&restaurant_tagcategory=10591&limit=30&currency=USD&open_now=false&lunit=km&lang=en_US';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': '9fb2021882msh171e8240522b6d4p1ba2b0jsnf7b0f2d14298',
		'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
	}
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}
    try{
        await fetch(``)
    }catch(err){
        console.log(err);
        NextResponse.json({message: err}, {status:500})
    }
}