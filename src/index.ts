interface ExternalUser {
    id : number;
    name: string;
    email:string;
    address:{
        street:string;
        city: string;
    }
    
}

interface ProcessedUser {
userId: number;
fullName: string;
corporateEmail: string;
location:string;
};

function MapUserResponse(user : ExternalUser):ProcessedUser{
return{
userId: user.id,
fullName: user.name,
corporateEmail:user.email.toLowerCase(),
location:`${user.address.street}, ${user.address.city}`,
};
}

async function FetchUsers(endpoint:string): Promise<ProcessedUser[]> {
  
    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error(`HTPP ${response.status} from ${endpoint}`);
        }

        const rawData = (await response.json()) as ExternalUser[] 
        return rawData.map(MapUserResponse);
    }


async function main(): Promise<void>{
const endpoints : string[]= [
        "https://jsonplaceholder.typicode.com/users",
        "https://jsonplaceholder.typicode.com/not-a-real-route",
        "https://this-domain-does-not-exist-12345.com/users",
]
const results = await Promise.allSettled(
    endpoints.map((endpoint) => FetchUsers(endpoint))
);

const allUsers : ProcessedUser[] = [];

results.forEach((result, index) => {
    if (result.status === "fulfilled") {
        allUsers.push(...result.value);
    }else{
        const reason = result.reason instanceof Error ? result.reason.message : "Unkown error" ;
        console.error(`Failed ${endpoints[index]} -> ${reason}`)
    }
});
console.log(`Loaded ${allUsers.length} Users from ${results.length} endpoints.`);
console.dir(allUsers.slice(0,2));
}

main();