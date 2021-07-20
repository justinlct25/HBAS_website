let x = 22.277112;
let y = 114.27389;
async function test(){
    const response = await fetch(`
      https://nominatim.openstreetmap.org/reverse?lat=${x}&lon=${y}&format=json&zoom=16
      `)
      if ( response.status === 200){
        const result = (await response.json())['address'];
        if ( result === undefined ){
          dataArray[i]['location'] = {error: 'invalid location'};
        }
        dataArray[i]['location'] = result;
      }else{
        dataArray[i]['location'] = {error: 'network error'};
      }
}
test();