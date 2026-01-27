'use client'
import Image from "next/image"
import { LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer } from "recharts";

const data = [
  { name: 'Jan', income: 2500, expense: 3000, amt: 500 },
  { name: 'Feb', income: 1800, expense: 2200, amt: 400 },
  { name: 'Mar', income: 10000, expense: 9500, amt: 500 },
  { name: 'Apr', income: 4200, expense: 4600, amt: 400 },
  { name: 'May', income: 5000, expense: 4800, amt: 200 },
  { name: 'Jun', income: 3200, expense: 3500, amt: 300 },
  { name: 'Jul', income: 4500, expense: 4200, amt: 300 },
  { name: 'Aug', income: 4600, expense: 4300, amt: 300 },
  { name: 'Sep', income: 4700, expense: 4400, amt: 300 },
  { name: 'Oct', income: 4800, expense: 4500, amt: 300 },
  { name: 'Nov', income: 4900, expense: 4600, amt: 300 },
  { name: 'Dec', income: 5000, expense: 4700, amt: 300 },
];



const FinanceChart = () => {
    return (

        <div className='bg-white rounded-xl w-full  h-full p-4'>
            {/* Title */}
            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold'>Student</h1>
                <Image src="/moreDark.png" alt='' width={20} height={20}/>
            </div>
            <ResponsiveContainer width="100%" height={400}>
                 <LineChart
                
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#ddd  "/>
      <XAxis dataKey="name"axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false} tickMargin={10}/>
      <YAxis width="auto"axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false} tickMargin={20}/>
      <Tooltip />
       <Legend align="center" verticalAlign='top' wrapperStyle={{paddingTop: "10px",paddingBottom:"30px"}}/>
      <Line type="monotone" dataKey="income" stroke="#5FFABF" strokeWidth={5} />
      <Line type="monotone" dataKey="expense" stroke="#58DB52" strokeWidth={5}/>
    </LineChart> 
            </ResponsiveContainer>
        </div>
       
                 
    );
};
export default FinanceChart