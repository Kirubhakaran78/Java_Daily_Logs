import React from 'react'
import scenary from "../images/scenary.jpg"
import sample1 from "../images/sample1.avif"

function TailwindPrac() {
    return (
        <div>

            <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-3xl font-bold">
      Tailwind v3 is working 🎉
    </div>

            {/* <img src={sample1} alt="scenary image" class="float-right size-32" /> */}
            {/* <div class="class=bg-sky-500">
                <div class="relative ...">
                    <p>Relative parent</p>
                    <div class="absolute bottom-0 left-0 ...">
                        <p>Absolute child</p>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default TailwindPrac
