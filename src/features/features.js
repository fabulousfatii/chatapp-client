

export const saveAlertsToLocalStorage = ({key,value,get}) => {
    if(get){
        const data= localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }else{
        localStorage.setItem(key, JSON.stringify(value));
    }
}