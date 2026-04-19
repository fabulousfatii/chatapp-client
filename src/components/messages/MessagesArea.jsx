import React from 'react'
import { useSelector } from 'react-redux';

const MessagesArea = ({messages}) => {
      const user = useSelector((state) => state.auth.userdata);
    
  // Skeleton loading state
 

 

  return (
    <>
     {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender._id === user._id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-500 text-gray-100'
                        }`}>
                        <p>{msg?.content}</p>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2">
                            {msg.attachments.map((attachment, attIndex) => (
                              <img key={attIndex} src={attachment.url} alt="attachment" className="max-w-full h-auto rounded-md mt-2" />
                            ))}
                          </div>
                        )}
                        <p className={`text-xs mt-1 ${msg.sender._id === user._id ? 'text-blue-100' : 'text-gray-900'}`}>
                          {msg?.time}
    
                        </p>
                      </div>
                    </div>
     ))}
    </>
  );
}

export default MessagesArea