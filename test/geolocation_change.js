let x = 22.277112;
let y = 114.27389;
// async function test(){
//     const response = await fetch(`
//       https://nominatim.openstreetmap.org/reverse?lat=${x}&lon=${y}&format=json&zoom=16
//       `)
//       if ( response.status === 200){
//         const result = (await response.json())['address'];
//         if ( result === undefined ){
//           dataArray[i]['location'] = {error: 'invalid location'};
//         }
//         dataArray[i]['location'] = result;
//       }else{
//         dataArray[i]['location'] = {error: 'network error'};
//       }
// }
const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
function test(){
  console.log(new Date().toISOString());
  console.log(new Date().getFullYear());
  console.log(new Date('2080-01-02').getFullYear());
  console.log(new Date('2021-07-22 15:32:00').toLocaleDateString('en-US', options));
  console.log(Date.parse("2021-07-22"));
}
test();