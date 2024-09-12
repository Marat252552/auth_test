export default async function validator(res, callback) {
    try {
        await callback();
    } catch(e) {
        if(e.message !== "handledError") {
            console.log(e);
            res.sendStatus(500);
        }
    }
}