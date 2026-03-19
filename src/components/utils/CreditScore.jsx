import React, { useMemo } from 'react';
import Button from './Button';
import Images from '../content/Images';
import { toast } from 'react-toastify';




const CreditScore = ({ scoreData }) => {
    const { score, label, color, border } = useMemo(() => {
        if (scoreData.score <= 0) {
            return { score: scoreData.score, label: "No Credit", color: "bg-primary text-white", border: "border-primary" };
        }
        if (scoreData.score > 0 && scoreData.score <= 550) {
            return { score: scoreData.score, label: "Poor Credit", color: "bg-red-800 text-white", border: "border-red-800" };
        }
        if (scoreData.score >= 551 && scoreData.score <= 620) {
            return { score: scoreData.score, label: "Low Credit", color: "bg-orange-600 text-white", border: "border-orange-600" };
        }
        if (scoreData.score >= 621 && scoreData.score <= 700) {
            return { score: scoreData.score, label: "Fair Credit", color: "bg-yellow-300 text-black", border: "border-yellow-300" };
        }
        if (scoreData.score >= 701 && scoreData.score <= 749) {
            return { score: scoreData.score, label: "Good Credit", color: "bg-green-500 text-white", border: "border-green-500" };
        }
        return { score: scoreData.score, label: "Excellent", color: "bg-lime-400 text-black", border: "border-lime-400" };
    }, [scoreData.score]);

    const bureauLogo = () => {
        if (scoreData.bureau === 'Equifax') {
            return Images.equifax;
        }
        if (scoreData.bureau === 'Experian') {
            return Images.Experian;
        }
        if (scoreData.bureau === 'CRIF') {
            return Images.crif;
        }
        return null;
    }
    // Helper function to capitalize and format keys
    const formatKey = (key) => {
        return key
            .replace(/([A-Z])/g, ' $1') // Add a space before capital letters
            .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
    };

    // Define only the keys you want to display
    const keysToDisplay = ['generatedOn', 'regenerateOn'];

    const handleGetScore = () => {
        if (scoreData.generated) {
            toast.error("No new score available");
        };
        if (!scoreData.generated) {
            toast.success("Score generated successfully");
        };
    };
    return (
        <div className={`flex items-center justify-center pb-5`}>
            <div className={`grid grid-cols-4 gap-4 w-7/12 border shadow-lg ${border}`}>
                <div className={`col-span-1 border ${border}`}>
                    <div className="grid grid-cols-2 gap-2 p-4">
                        <div className="flex justify-center items-center">
                            <img src={bureauLogo()} className="h-6" alt="Credit Logo" />
                        </div>
                        <div className="flex justify-center items-center">
                            <span className="text-2xl font-bold">{score}</span>
                        </div>
                    </div>
                    <div className={`flex justify-center items-center ${color}`}>
                        <span className="text-base">{label}</span>
                    </div>
                </div>

                <div className={`col-span-2`}>

                    <div className='grid grid-cols-2 gap-2'>
                        {keysToDisplay.map((key) => (

                            <div className='m-auto py-6' key={key}>
                                <div className='text-xs'>{formatKey(key)}: </div>
                                <div className='font-bold'>{scoreData[key]}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <Button
                        btnName={scoreData.generated ? "Regenerate" : "Get Score"}
                        onClick={handleGetScore}
                        type="button"
                        btnIcon="IoCheckmarkCircleOutline"
                        style={`bg-primary text-white hover:bg-secondary hover:text-black min-w-[120px] `}
                    />
                </div>
            </div>
        </div>
    );
};

export default CreditScore;
