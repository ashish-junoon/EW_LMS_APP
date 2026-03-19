import Card from "./Card";
import Icon from "./Icon";

function SelectedLoan({ data }) {
    // Ensure loanData is an array
    const loanData = data.getAssignProduct || [];

    return (
        <div className="border-t border-b border-light">
            <div className="bg-gray-100 py-0.5 px-8">
                <h1 className="font-semibold italic">Assigned Products</h1>
            </div>
            <div className="grid grid-cols-3 gap-8 p-5 ">
                {loanData.map((loan) => (
                    <Card
                        key={loan.product_code}
                        icon={"GiMoneyStack"}
                        heading={`${loan.product_name} - ₹${loan.loan_amount}`}
                        style={"p-5"}
                    >
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <div className="text-xs italic text-dark font-semibold">
                                    Loan Amount
                                </div>
                                <div className="flex items-center text-sm font-bold">
                                    <Icon name={"MdCurrencyRupee"} size={14} />
                                    {loan.loan_amount}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs italic text-dark font-semibold">
                                    Loan Tenure
                                </div>
                                <div className="text-xs font-bold">{loan.tenure}</div>
                            </div>
                            <div>
                                <div className="text-xs italic text-dark font-semibold">
                                    Interest Rate
                                </div>
                                <div className="text-sm font-bold">{loan.interest_rate}%</div>
                            </div>
                            <div>
                                <div className="text-xs italic text-dark font-semibold">
                                    Processing Fee
                                </div>
                                <div className="text-sm font-bold">{loan.processing_fee}%</div>
                            </div>
                            <div>
                                <div className="text-xs italic text-dark font-semibold">
                                    CGST
                                </div>
                                <div className="text-sm font-bold">{loan.cgst}%</div>
                            </div>
                            <div>
                                <div className="text-xs italic text-dark font-semibold">
                                    SGST
                                </div>
                                <div className="text-sm font-bold">{loan.sgst}%</div>
                            </div>
                        </div>
                    </Card>
                ))
                }
            </div>
        </div>
    );
}

export default SelectedLoan;
