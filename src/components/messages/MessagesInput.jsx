import {  File, FileAudio, FileAudioIcon, Image, Pin, Send, Voicemail } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSendAttachmentsMutation } from '../../redux/api/api';

const MessagesInput = ({onInputMessage,typeTimeoutRef, message, setMessage, handleSendMessage,selectedChat}) => {


  const [openFilePicker, setOpenFilePicker] = useState(false);
  const [sendAttachments] = useSendAttachmentsMutation();
  

            const handleKeyPress = (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        };

        const handleFile = (e,inputType) => {

           if(inputType === "image"){
            const files = Array.from(e.target.files);


            const formdata= new FormData();
            formdata.append("chatId",selectedChat._id);
            files.forEach((file)=>{
              formdata.append("files",file);
            })

            sendAttachments(formdata);

           }
          if(inputType === "file"){ 
            
          }
      }

// Click outside to close file picker
const dialogRef = useRef(null);
useEffect(() => {
  const handleOutsideClick = (e) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target)) {
      setOpenFilePicker(false);
    }
  };

  document.addEventListener("mousedown", handleOutsideClick);
  return () => document.removeEventListener("mousedown", handleOutsideClick); // cleanup
}, [openFilePicker]);



  return (
            <div className="bg-white border-t text-black border-gray-200 p-4">
              <div className="flex gap-2">
                
                {/* send files */}
                <div className=' relative text-gray-700 '>
                  { openFilePicker && (
                    <div ref={dialogRef}  className='absolute bottom-10 left-0 w-40 h-18 bg-gray-200 rounded-xl flex flex-wrap gap-3 justify-center items-center'>

                    <div className='mt-3 cursor-pointer'>
                      <input hidden 
                      onChange={(e)=>handleFile(e,"file")} 
                      type="file" id='fileinput' />
                     <label className='mt-3 cursor-pointer' htmlFor="fileinput"><File /></label>
                    </div>

                    <div className='mt-3 cursor-pointer'>
                       <input hidden multiple
                       onChange={(e)=>handleFile(e,"image")}  
                       type="file" id="imageinput" accept="image/png , image/jpeg , image/gif"  />
                       <label className='mt-3 cursor-pointer' htmlFor="imageinput"><Image /></label>
                    </div >

                    <div> 
                      <input hidden 
                      onChange={(e)=>handleFile(e,"audio")}  
                      type="file" id="audioinput" accept="audio/*"  />
                      <label className='mt-3 cursor-pointer' htmlFor="audioinput"><FileAudioIcon/></label>
                      </div>
                  </div>
                  )

                  }
                  <button className='mt-3 cursor-pointer' onClick={()=>setOpenFilePicker((prev)=>!prev)}  >  <File/> </button>
                </div>

                 {/* text input and send button */}
                <input
                  type="text"
                  ref={typeTimeoutRef}
                  value={message}
                  onChange={(e) => onInputMessage(e)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>  )
}

export default MessagesInput