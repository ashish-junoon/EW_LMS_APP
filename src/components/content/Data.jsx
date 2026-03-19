import Icon from '../utils/Icon';


// const menuItem = [
//     {
//         name: "Dashboard",
//         icon: <Icon name="MdOutlineDashboard" size={20} />,
//         path: "/",
//     },
//     {
//         name: "Manage Leads",
//         icon: <Icon name="IoMagnetOutline" size={20} />,
//         menuItems: [
//             {
//                 path: "/manage-leads/new-leads",
//                 name: "Leads",
//                 icon: <Icon name="RiAlbumLine" size={10} />,
//             },
//             {
//                 path: "/manage-leads/leads-verification",
//                 name: "Lead Verification",
//                 icon: <Icon name="RiAlbumLine" size={10} />,
//             },
//             {
//                 path: "/manage-leads/credit-assessment",
//                 name: "Credit Assessment",
//                 icon: <Icon name="RiAlbumLine" size={10} />,
//             },
//             {
//                 path: "/manage-leads/leads-in-kyc",
//                 name: "Leads KYC Status",
//                 icon: <Icon name="RiAlbumLine" size={10} />,
//             },
//         ]
//     },
//     {
//         name: "Manage Disbursal",
//         icon: <Icon name="RiMoneyRupeeCircleLine" size={20} />,
//         path: "/manage-leads/manage-disbursal",
//     },
//     {
//         name: "Active Loans",
//         icon: <Icon name="GiMoneyStack" size={20} />,
//         path: "/loan/loan-accounts"
//     },

//     {
//         name: "Manage Application",
//         icon: <Icon name="IoDocumentsOutline" size={20} />,
//         path: "/lead/rejected-leads",
//     },
//     {
//         name: "Loan Collection",
//         icon: <Icon name="GiTakeMyMoney" size={20} />,
//         menuItems: [
//             {
//                 name: "Current Due",
//                 icon: <Icon name="RiAlbumLine" size={10} />,
//                 path: "/collection/dues",
//             },
//             {
//                 name: "Overdue EMI",
//                 icon: <Icon name="RiAlbumLine" size={10} />,
//                 path: "/collection/overdues",
//             }
//         ]
//     },

//     {
//         name: "Reports",
//         icon: <Icon name="RiFileExcel2Line" size={20} />,
//         path: "/reports"
//     },
//     {
//         name: "Admin",
//         icon: <Icon name="RiUserSettingsLine" size={20} />,
//         menuItems: [
//             {
//                 path: "admin/manage-users",
//                 name: "Manage Users",
//                 icon: <Icon name="RiAlbumLine" size={10} />,
//             },
//             {
//                 path: "admin/manage-products",
//                 name: "Manage Products",
//                 icon: <Icon name="RiAlbumLine" size={10} />,
//             },
//             {
//                 path: "admin/manage-department",
//                 name: "Manage Department",
//                 icon: <Icon name="RiAlbumLine" size={10} />,
//             },
//             {
//                 path: "admin/manage-designation",
//                 name: "Manage Designation",
//                 icon: <Icon name="RiAlbumLine" size={10} />,
//             },
//             {
//                 path: "/admin/manage-branch",
//                 name: "Manage Branch",
//                 icon: <Icon name="RiAlbumLine" size={10} />,
//             },
//             {
//                 path: "/admin/manage-bank-accounts",
//                 name: "Manage Bank Accounts",
//                 icon: <Icon name="RiAlbumLine" size={10} />,
//             },

//         ]
//     },
//     {
//         name: "Administrator",
//         icon: <Icon name="RiUserSettingsLine" size={20} />,
//         menuItems: [

//             {
//                 path: "/administrator/manage-page-urls",
//                 name: "Manage Page URLs",
//                 icon: <Icon name="RiAlbumLine" size={10} />,
//             }
//         ]
//     },
// ];

const paymentType = [
    {label: "Full Payment", value: "fullPayment"},
    {label: "Part Payment", value: "partPayment"}
]

const notifyItems = [
    {
        href: '/path1',
        label: 'New Application',
        description: 'New loan application received 1m ago ',
        icon: <Icon name="IoNotificationsCircle" size={20} color="black" />
    },
    {
        onClick: () => alert('Clicked Item 2!'),
        href: '/path1',
        label: 'New Application',
        description: 'New loan application received 15m ago',
        icon: <Icon name="IoNotificationsCircle" size={20} color="black" />
    },
    {
        // onClick: () => alert('Clicked Item 2!'),
        href: '/path1',
        label: 'New Application',
        description: 'New loan application received 30m ago',
        icon: <Icon name="IoNotificationsCircle" size={20} color="black" />
    },
    {
        // onClick: () => alert('Clicked Item 2!'),
        href: '/path1',
        label: 'New Application',
        description: 'New loan application received 2h ago',
        icon: <Icon name="IoNotificationsCircle" size={20} color="black" />
    },
    {
        // onClick: () => alert('Clicked Item 2!'),
        href: '/path1',
        label: 'New Application',
        description: 'New loan application received 1d ago',
        icon: <Icon name="IoNotificationsCircle" size={20} color="black" />
    }
];

const steperItems = [
    { title: 'Personal' },
    { title: 'Employment' },
    { title: 'Address' },
    { title: 'KYC' },
    { title: 'Bank' },
]

const houseTypeOptions = [
    { label: "Rented", value: "Rented" },
    { label: "Owned", value: "Owned" },
]

const scorePlatform = [
    { label: "Transunion", value: "Transunion" },
    { label: "Experian", value: "Experian" },
    // { label: "Equifax", value: "Equifax" },
]


const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Others', label: 'Others' }
]

const maritalStatusOptions = [
    { label: "Married", value: "Married" },
    { label: "Unmarried", value: "Unmarried" },
]

const educationOptions = [
    { label: "Diploma", value: "Diploma" },
    { label: "Matric", value: "Matric" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Graduate", value: "Graduate" },
    { label: "Post Graduate", value: "PostGraduate" },
];


const features = [
    { id: 1, icon: "GiMoneyStack", text: "Instant Approval" },
    { id: 2, icon: "IoEyeOffOutline", text: "No Hidden Charges" },
    { id: 3, icon: "RiDiscountPercentLine", text: "Competitive Interest" },
    { id: 4, icon: "IoDocumentsOutline", text: "Minimal Documentation" },
];

const leadRemarks = [
    { label: "Interested", value: "Interested" },
    { label: "Follow-up", value: "Follow-up" },
    { label: "No Answer", value: "No Answer" },
    { label: "Not Eligible", value: "Not Eligible" },
    { label: "Not Interested", value: "Not Interested" },
    { label: "Fake Application", value: "Fake Application" },
    { label: "Incomplete Documents", value: "Incomplete Documents" },
];

const addRemarkOptions = [
    { label: "Follow-up", value: "Follow-up" },
    { label: "No Answer", value: "No Answer" },
    { label: "Number Not Available", value: "Number Not Available" },
    { label: "Number Not Reachable", value: "Number Not Reachable" },
    { label: "Switched Off", value: "Switched Off" },
    { label: "Call Disconnected", value: "Call Disconnected" },
    { label: "Wrong Number", value: "Wrong Number" },
    { label: "Requested Call Back", value: "Requested Call Back" },
];


const leadStep1 = [
    { label: "Interested", value: "Interested" },
    { label: "Not Eligible", value: "Not Eligible" },
    { label: "Not Interested", value: "Not Interested" },
    { label: "Fake Application", value: "Fake Application" },
    { label: "Incomplete Documents", value: "Incomplete Documents" },
]

const rejectLead = [
    { label: "Not Eligible", value: "Not Eligible" },
    { label: "Not Interested", value: "Not Interested" },
    { label: "Fake Application", value: "Fake Application" },
    { label: "Fake Aadhaar Card", value: "Fake Aadhaar Card" },
    { label: "Fake PAN Card", value: "Fake PAN Card" },
    { label: "Fake Salary Slip", value: "Fake Salary Slip" },
    { label: "Fake Bank Statement", value: "Fake Bank Statement" },
    { label: "Incomplete Documents", value: "Incomplete Documents" },
];

const eKYCRemarks = [
    { label: "Adhaar Unverified", value: "Adhaar Unverified" },
    { label: "PAN Unverified", value: "PAN Unverified" },
    { label: "eMandate not Activated", value: "eMandate not Activated" },
    { label: "Unverified Loan Consent", value: "Unverified Loan Consent" },
    { label: "eKYC could not finish ", value: "eKYC could not finish " },
]


const disbursedRemarks = [
    { label: "Bnak Account Unverified", value: "Bnak Account Unverified" },
    { label: "Suspicious Profile", value: "Suspicious Profile" },
    { label: "Hold Disbursement", value: "Hold Disbursement" },
]

const assessmentRemarks = [
    { label: "Low Credit Score", value: "Low Credit Score" },
    { label: "Mismatch in Documents", value: "Mismatch in Documents" },
    { label: "Unstable Employment", value: "Unstable Employment" },
    { label: "Poor Repayment History", value: "Poor Repayment History" },
    { label: "High Credit Utilization", value: "High Credit Utilization" },
    { label: "High Days Past Due (DPD)", value: "High Days Past Due (DPD)" },
    { label: "Multiple Active Loan Accounts", value: "Multiple Active Loan Accounts" },
];


const actionType = [
    { label: "Call", value: "Call" },
    { label: "QC Check", value: "QC Check" },
    { label: "Credit Check", value: "Credit Check" },
];

//Filter and search status options

const assignStatus = [
    { label: "Unassigned", value: "Unassigned" },
    { label: "Assigned", value: "Assigned" },
];

const disbursalStatus = [
    { label: "Pending-Disbursal", value: "Pending-Disbursal" },
    { label: "Hold-Disbursal", value: "Hold-Disbursal" },
];

const emiStatus = [
    { label: "Due", value: "Due" },
    { label: "Paid", value: "Paid" },
];

const manageApp = [
    { label: "Followup", value: "Followup" },
    { label: "Rejected", value: "Rejected" },
    { label: "Blacklisted", value: "Blacklisted" },
];
const branchList = [
    { label: "Active", value: "A" },
    { label: "Closed", value: "C" },
    { label: "Settled", value: "S" },
    { label: "NPA", value: "N" },
];



const qcStatus = [
    { label: "QC-Verified", value: "QC-Verified" },
    { label: "Followup", value: "Followup" },
    { label: "Reject", value: "Reject" },
    { label: "Blacklist", value: "Blacklist" },
];

const creditApprovalStatus = [
    { label: "Approved", value: "Approved" },
    { label: "Followup", value: "Followup" },
    { label: "Reject", value: "Reject" },
    { label: "Blacklist", value: "Blacklist" },
];

const creditApprovalRemarks = [
    { label: "Poor credit score", value: "Poor credit score" },
    { label: "Low credit score", value: "Low credit score" },
    { label: "Fair credit score", value: "Fair credit score" },
    { label: "Good credit score", value: "Good credit score" },
    { label: "Excellent credit score", value: "Excellent credit score" },
    { label: "Incomplete information", value: "Incomplete information" },
];

const leadStatus = [
    { label: "New", value: "New" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
];

const kycStatus = [
    { label: "Pending-KYC", value: "Pending-KYC" },
    { label: "Verified-KYC", value: "Verified-KYC" },
    { label: "Rejected", value: "Rejected" },
];

const loanStatus = [
    { label: "Active", value: "Active" },
    { label: "Hold", value: "Hold" },
];

const collectionStatus = [
    { label: "Paid", value: "10" },
    { label: "Settled", value: "12" },
    { label: "Partially", value: "6" },
    { label: "Foreclosure", value: "11" },
    { label: "NPA", value: "13" },
    { label: "Waive-Off", value: "15" },
];

const collectionPaymentMode = [
    { value: "NEFT", label: "NEFT" },
    { value: "RTGS", label: "RTGS" },
    { value: "IMPS", label: "IMPS" },
    { value: "UPI", label: "UPI" },
    { value: "CARD", label: "CARD" },
    { value: "CASH", label: "CASH" },
]

const paymentMode = [
    { label: "NEFT", value: "NEFT" },
    { label: "RTGS", value: "RTGS" },
    { label: "UPI", value: "UPI" },
    { label: "Cheque", value: "Cheque" }
]

const disburesementMode = [
    { label: "NEFT", value: "NEFT" },
    { label: "RTGS", value: "RTGS" },
    { label: "IMPS", value: "IMPS" }
]

const emiStaus = [
    { label: "Settled", value: "12" },
    { label: "Fully Paid", value: "10" },
    { label: "Write-Off", value: "13" },
    { label: "Partially Paid", value: "6" },
    { label: "Foreclosed", value: "11" },
]

const relationOptions = [
    { label: "Father", value: "Father" },
    { label: "Mother", value: "Mother" },
    { label: "Brother", value: "Brother" },
    { label: "Sister", value: "Sister" },
    { label: "Husband", value: "Husband" },
    { label: "Spouse", value: "Spouse" },
    { label: "Friend", value: "Friend" }
]

const userStatus = [
    { label: "Active", value: "1" },
    { label: "Inactive", value: "0" },
]

const emplyeeType = [
    { label: "Full-time", value: "Full-time" },
    { label: "Part-time", value: "Part-time" },
    { label: "Temporary", value: "Temporary" },
    { label: "Leased", value: "Leased" },
]

const userRole = [
    { label: "Admin", value: "1" },
    { label: "Executive", value: "2" },
    { label: "QC Manager", value: "3" },
    { label: "Credit Manager", value: "4" }
]

const productType = [
    { label: "Personal Loan", value: "Personal Loan" },
    { label: "Home Loan", value: "Home Loan" },
    { label: "Car Loan", value: "Car Loan" }
]

const repaymentFrequency = [
    { label: "Monthly", value: "Monthly" },
    { label: "Bi-Weekly", value: "Bi-Weekly" },
    { label: "Weekly", value: "Weekly" },
    { label: "Daily", value: "Daily" }
]

const loanTenure = [
    { label: "3 Months", value: "3 Months" },
    { label: "6 Months", value: "6 Months" },
    { label: "9 Months", value: "9 Months" },
    { label: "12 Months", value: "12 Months" },
    { label: "18 Months", value: "18 Months" },
    { label: "24 Months", value: "24 Months" },
    { label: "36 Months", value: "36 Months" },
]

const interestType = [
    { label: "Fixed", value: "Fixed" },
    { label: "Reducing", value: "Reducing" },
]

const nameTitle = [
    { label: "Mr", value: "Mr" },
    { label: "Mrs", value: "Mrs" },
    { label: "Ms", value: "Ms" },
    { label: "Miss", value: "Miss" }
]




const documentType = [
    { label: "Selfie", value: "Selfie" },
    { label: "ID Card", value: "idCard" },
    { label: "Water Bill", value: "WaterBill" },
    { label: "Salary Slip", value: "SalarySlip" },
    { label: "Credit Report", value: "CreditReport" },
    { label: "Bank Statement", value: "BankStatement" },
    { label: "Rent Agreement", value: "RentAgreement" },
    { label: "Electricity Bill", value: "ElectricityBill" },
    { label: "Postpaid Mobile Bill", value: "PostpaidMobileBill" },
    { label: "Video Kyc", value: "VideoKyc" },  // newly added Rohit
    { label: "Other Bank Statement", value: "OtherBankStatement" },  // newly added Rohit
    // { label: "Other", value: "Other" },
]

const exportDataType = [
    { label: "Rejected", value: "rejected" },
    { label: "Recovery", value: "recovery" },
    { label: "Master Data", value: "master" },
    { label: "Disbursement", value: "disbursement" },
]
const exportLeadSource = [
    { value: "0", label: "In-complete" },
    { value: "7", label: "Rejected" },
    { value: "2", label: "Verification" },
    { value: "3", label: "Assessment" },
    { value: "4", label: "Pending KYC" },
    { value: "5", label: "Disbursal" },
];

const exportStatusSource = [
    { value: "22", label: "Due" },
    { value: "23", label: "Overdue" },
    { value: "1", label: "Active Loan" },
    { value: "10", label: "Closed Loan" },
    { value: "15", label: "Writeoff" },
    { value: "11", label: "Foreclosed" },
];

const exportCollectionSource = [
    { value: "30", label: "DPD <30 Days" },
    { value: "60", label: "DPD <60 Days" },
    { value: "90", label: "DPD <90 Days" },
    { value: "91", label: "DPD >91 Days" },
];



// const bankListData = {
//   success: true,
//   message: "success",
//   data: [
//     {
//       bankId: "BURX",
//       bankName: "THE BURDWAN CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "KRDX",
//       bankName: "THE KRISHNA DISTRICT CO OP BANK",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DGBX",
//       bankName: "TELANGANA GRAMEENA BANK",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KUKX",
//       bankName: "THE KUKARWADA NAGARIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "AKOX",
//       bankName: "THE AKOLA URBAN CO OP BANK LTD",
//       netbankFlag: true,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KCCB",
//       bankName: "THE KALUPUR COMMERCIAL CO OP BANK",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "IUCB",
//       bankName: "INTEGRAL URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JSFB",
//       bankName: "JANA SMALL FINANCE BANK LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CGBX",
//       bankName: "CHHATTISGARH GRAMIN BANK",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BRMX",
//       bankName: "BRAMHAPURI URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NGSB",
//       bankName: "NAGPUR NAGARIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "HPSX",
//       bankName: "THE HIMACHAL PRADESH STATE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "MGBX",
//       bankName: "MAHARASHTRA GRAMIN BANK",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "HSBC",
//       bankName: "THE HONGKONG AND SHANGHAI BANKING CORPORATION LTD",
//       netbankFlag: true,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PSIB",
//       bankName: "PUNJAB AND SIND BANK",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "SCBL",
//       bankName: "STANDARD CHARTERED BANK",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "UCUX",
//       bankName: "UNIVERSAL CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ESAF",
//       bankName: "ESAF SMALL FINANCE BANK LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MDGX",
//       bankName: "RAJASTHAN GRAMIN BANK",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ESFB",
//       bankName: "EQUITAS SMALL FINANCE BANK LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "CNRB",
//       bankName: "CANARA BANK",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "KAYX",
//       bankName: "THE KANYAKUMARI DISTRICT CENTRAL CO OP BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DCKX",
//       bankName: "THE DISTRICT CO OP CENTRAL BANK LTD KURNOOL",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PBGX",
//       bankName: "PUDUVAI BHARATHIAR GRAMA BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JSHX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MYDT SHAJAPUR",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PSRX",
//       bankName: "SRI POTTI SRIRAMULU NELLORE DCCB",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "UNBA",
//       bankName: "UNITY SMALL FINANCE BANK LIMITED",
//       netbankFlag: true,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JBHX",
//       bankName: "JILA SAHAKRI KENDRIYA BANK MARYADIT BHIND",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KLGB",
//       bankName: "KERALA GRAMIN BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "FDRL",
//       bankName: "FEDERAL BANK",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "JJSB",
//       bankName: "JALGAON JANATA SAHKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JANA",
//       bankName: "JANASEVA SAHAKARI BANK LTD PUNE",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "GDCX",
//       bankName: "THE GUNTUR DISTRICT CO OP CENTRAL BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DAUX",
//       bankName: "DAUSA URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PUNB",
//       bankName: "PUNJAB NATIONAL BANK",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "NNSB",
//       bankName: "NUTAN NAGARIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TIDX",
//       bankName: "THE THIRUVANNAMALAI DISTRICT CENTRAL CO OP BANK LT",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "VISX",
//       bankName: "THE VISAKHAPATNAM CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SIBL",
//       bankName: "THE SOUTH INDIAN BANK LIMITED",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "JKMX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MARYADIT JAGDALPUR",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SADX",
//       bankName: "THE SABARKANTHA DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "UBIN",
//       bankName: "UNION BANK OF INDIA",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "CGGX",
//       bankName: "ANDHRA PRADESH GRAMEENA BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BAVX",
//       bankName: "THE BAVLA NAGRIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NUBX",
//       bankName: "THE NEW URBAN CO OP BANK LTD RAMPUR",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MUBL",
//       bankName: "THE MUNICIPAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PMEC",
//       bankName: "PRIME CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PVAX",
//       bankName: "THE PAVANA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JGWX",
//       bankName: "JILA SAHAKARI BANK MYDT GWALIOR",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KDUX",
//       bankName: "THE KODAGU DISTRICT CO OP CENTRAL BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BNSX",
//       bankName: "BHAGINI NIVEDITA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JKRX",
//       bankName: "JILLA SAHAKARI KENDRIYA BANK MYDT RAISEN",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JBMX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MARYADIT SAGAR",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "VERX",
//       bankName: "THE VERAVAL MERCANTILE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "IDFB",
//       bankName: "IDFC FIRST BANK LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "SUSX",
//       bankName: "THE SIRSI URBAN SAHAKARI BANK LTD SIRSI",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MAHB",
//       bankName: "BANK OF MAHARASHTRA",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "JIBX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MARYADIT ,BALAGHAT",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "VIDX",
//       bankName: "VIDYASAGAR CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CHDX",
//       bankName: "THE CHITTOOR DISTRICT CO OP CENTRAL BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BMPX",
//       bankName: "THE BANASKANTHA MERCANTILE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "PCUX",
//       bankName: "THE POCHAMPALLY CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DDCX",
//       bankName: "DARJEELING DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ADBX",
//       bankName: "THE AHMEDABAD DISTRICT CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "IPPB",
//       bankName: "INDIA POST PAYMENTS BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "SVCB",
//       bankName: "SVC CO OP BANK LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KOTX",
//       bankName: "THE KODINAR TALUKA CO OP BANKING UNION LTD K",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ICIC",
//       bankName: "ICICI BANK LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "JHSX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MARYADIT HOSHANGABAD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JIGX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MARYADIT ,GUNA",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "AACX",
//       bankName: "AKHAND ANAND CO OP BANK LTD",
//       netbankFlag: true,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SWSX",
//       bankName: "SHREE WARANA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MERX",
//       bankName: "MEGHALAYA RURAL BANK",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NSPB",
//       bankName: "NSDL PAYMENTS BANKS LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "HDFC",
//       bankName: "HDFC BANK LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "HUTX",
//       bankName: "HUTATMA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TSIX",
//       bankName: "THE SHILLONG CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "STCB",
//       bankName: "SBM BANK INDIA LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: true
//     },
//     {
//       bankId: "CDCX",
//       bankName: "THE CUDDALORE DISTRICT CENTRAL CO OP BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SEWX",
//       bankName: "SHRI MAHILA SEWA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "ASOX",
//       bankName: "THE ASSOCIATE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JIOX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MARYADIT SHAHDOL",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BDCX",
//       bankName: "THE BIJAPUR DISTRICT CENTRAL CO OP BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DCDX",
//       bankName: "THE DISTRICT CENTRAL CO OP BANK LTD ELLURU",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TMBL",
//       bankName: "TAMILNAD MERCANTILE BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "CHNX",
//       bankName: "THE CHARADA NAGARIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DLXB",
//       bankName: "DHANALAXMI BANK",
//       netbankFlag: true,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "KCTX",
//       bankName: "THE KAKINADA COOPERATIVE TOWN BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SBIN",
//       bankName: "STATE BANK OF INDIA",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TSHX",
//       bankName: "THE SHAHADA PEOPLES COOP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "UCBA",
//       bankName: "UCO BANK",
//       netbankFlag: true,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "VSBL",
//       bankName: "THE VISHWESHWAR SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JNDX",
//       bankName: "THE JUNAGADH JILLA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JSTX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MYDT SATNA",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KOSX",
//       bankName: "KOTA NAGRIK SAHKARI BANK LTD KOTA",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "UTGX",
//       bankName: "UTTARAKHAND GRAMIN BANK",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JRNX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MARYADIT RAJNANDGAON",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "COMX",
//       bankName: "THE COOP BANK OF MEHSANA LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "AMRX",
//       bankName: "AMRELI JILLA MADHYASTHA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SCOB",
//       bankName: "SAMRUDDHI CO OP BANK LTD NAGPUR",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SURY",
//       bankName: "SURYODAY SMALL FINANCE BANK LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "KDIX",
//       bankName: "SHREE KADI NAGARIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MZRX",
//       bankName: "MIZORAM RURAL BANK",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "VEDX",
//       bankName: "THE VELLORE DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JRKX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MYDT UJJAIN",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "GDUX",
//       bankName: "THE GODHRA URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BALX",
//       bankName: "BALASINOR NAGARIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "RACX",
//       bankName: "RAJKOT COMMERCIAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JIMX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MARYADIT MANDLA",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ACUX",
//       bankName: "THE ADARSH CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SAVX",
//       bankName: "SARDAR VALLABHBHAI SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CLBL",
//       bankName: "CAPITAL SMALL FINANCE BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "BKID",
//       bankName: "BANK OF INDIA",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "VIJX",
//       bankName: "THE VIJAY CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "BDBL",
//       bankName: "BANDHAN BANK LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "BARB",
//       bankName: "BANK OF BARODA",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "KUCB",
//       bankName: "THE KARAD URBAN CO OP BANK LTD",
//       netbankFlag: true,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MVTX",
//       bankName: "THE MUVATTUPUZHA URBAN CO OPERATIVE BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MNBX",
//       bankName: "MAHILA CO OP NAGARIK BANK LTD BHARUCH",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CRSX",
//       bankName: "CG RAJYA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "IDIB",
//       bankName: "INDIAN BANK",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "PUDX",
//       bankName: "PUDUKOTTAI DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DEUT",
//       bankName: "DEUTSCHE BANK AG",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BHOX",
//       bankName: "BHOPAL CO-OP CENTRAL BANK",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NJCX",
//       bankName: "THE NAV JEEVAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CNSX",
//       bankName: "THE CHEMBUR NAGARIK SAHAKARI BANK",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KKBK",
//       bankName: "KOTAK MAHINDRA BANK LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "IOBA",
//       bankName: "INDIAN OVERSEAS BANK",
//       netbankFlag: true,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SDCB",
//       bankName: "THE SURAT DISTRICT CO OP BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "INDB",
//       bankName: "INDUSIND BANK",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DCBX",
//       bankName: "DINDIGUL CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TSUX",
//       bankName: "THE SAURASHTRA CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NGKX",
//       bankName: "NAGRIK SAHAKARI BANK MARYADIT GWALIOR",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MYAX",
//       bankName: "THE MEGHALAYA CO OP APEX BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JBIX",
//       bankName: "JILA SAHKARI KENDRIYA BANK MARYADIT BILASPUR",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JONX",
//       bankName: "JODHPUR NAGRIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "IPSX",
//       bankName: "INDORE PARASPAR SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SMBX",
//       bankName: "SAMPADA SAHAKARI BANK LTD PUNE",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BMSX",
//       bankName: "THE BHAGYALAKSHMI MAHILA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DCBL",
//       bankName: "DCB BANK LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "JAKA",
//       bankName: "THE JAMMU AND KASHMIR BANK LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JKHX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MARYADIT ,KHARGONE",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JSKX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MARYADIT RAIPUR",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JPCB",
//       bankName: "THE JALGAON PEOPLES CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "GDOX",
//       bankName: "THE GODHRA CITY CO OP BANK LTD GODHRA",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TGNX",
//       bankName: "THE GANDHINAGAR NAGRIK CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NNCX",
//       bankName: "THE NARODA NAGRIK CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SKNX",
//       bankName: "THE SANKHEDA NAGARIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TBSB",
//       bankName: "THANE BHARAT SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JMAX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MYDT MANDSAUR",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DMKB",
//       bankName: "DMK JAOLI BANK",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TCBX",
//       bankName: "THE CO OP BANK OF RAJKOT LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "STNX",
//       bankName: "THE SANTRAMPUR URBAN CO OP BANK LIMITED",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "UTKS",
//       bankName: "UTKARSH SMALL FINANCE BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "ACUB",
//       bankName: "THE ARYAPURAM CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DCUX",
//       bankName: "THE DARUSSALAM CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "VVCX",
//       bankName: "THE VALLABH VIDYANAGAR COMMERCIAL BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TETX",
//       bankName: "TTC CO-OPERATIVE BANK LIMITED",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CIDX",
//       bankName: "THE CHIKMAGALUR DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PNCX",
//       bankName: "THE PANIPAT URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SNSX",
//       bankName: "SMRITI NAGRIK SAHAKARI BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PYTM",
//       bankName: "PAYTM PAYMENTS BANK LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TADX",
//       bankName: "THE ANANTAPUR DISTRICT CO OPERATIVE CENTRAL BANK L",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "UMCX",
//       bankName: "THE UMRETH URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "VGBX",
//       bankName: "JHARKHAND RAJYA GRAMIN BANK",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "COSB",
//       bankName: "THE COSMOS CO-OPERATIVE BANK LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "GCUX",
//       bankName: "THE GAYATRI CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "VARA",
//       bankName: "THE VARACHHA CO OP BANK LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "KAAX",
//       bankName: "KADAPA DIST CO-OP CENTRAL BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "IPCX",
//       bankName: "INDORE PREMIER CO OP BANK LTD INDORE",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JIRX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MARYADIT RAJGARH",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JSBP",
//       bankName: "JANATA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JUCX",
//       bankName: "THE JUNAGADH COMMERCIAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MUSX",
//       bankName: "THE MUSLIM CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "UJSX",
//       bankName: "UNJHA NAGARIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JRSX",
//       bankName: "JALORE NAGRIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "FINO",
//       bankName: "FINO PAYMENTS BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SUNB",
//       bankName: "SURAT NATIONAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KNBX",
//       bankName: "THE KALOL NAGARIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JICX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MARYADIT CHHINDWARA",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KNSB",
//       bankName: "KURLA NAGARIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KMCB",
//       bankName: "KOKAN MERCANTILE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SPCB",
//       bankName: "THE SURAT PEOPLES CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KARX",
//       bankName: "THE KAIRA DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TVDX",
//       bankName: "THE DISTRICT CO OP CENTRAL BANK LTD VIZIANAGARAM",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PDSX",
//       bankName: "PRIYADARSHANI NAGARI SAHAKARI BANK LTD JALNA",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NMCX",
//       bankName: "NAVI MUMBAI CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MDMX",
//       bankName: "MANN DESHI MAHILA SAHKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "GSSX",
//       bankName: "GUARDIAN SOUHARDA SAHAKARI BANK NIYAMITA",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JMCX",
//       bankName: "MOTIRAM AGRAWAL JALNA MERCHANTS CO-OPERATIVE BANK",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CMDX",
//       bankName: "THE COIMBATORE DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "AUBL",
//       bankName: "AU SMALL FINANCE BANK",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "BRUX",
//       bankName: "THE BHARUCH DISTRICT CENTRAL CO OP BANK LTD BHARUC",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "IBKL",
//       bankName: "IDBI BANK",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TASX",
//       bankName: "THE ANNASAHEB SAVANT CO OP URBAN BANK MAHAD LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SHIX",
//       bankName: "SHIVALIK SMALL FINANCE BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "CSBK",
//       bankName: "CSB BANK LIMITED",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "AMCB",
//       bankName: "AHMEDABAD MERCANTILE CO-OPBANK LTD",
//       netbankFlag: true,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KARB",
//       bankName: "KARNATAKA BANK LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "PABX",
//       bankName: "TAMIL NADU GRAMA BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TNSC",
//       bankName: "TAMILNADU STATE APEX CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MIZX",
//       bankName: "THE MIZORAM CO OP APEX BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ARCX",
//       bankName: "ARUNACHAL PRADESH STATE CO OP APEX BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CBIN",
//       bankName: "CENTRAL BANK OF INDIA",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "SRCB",
//       bankName: "SARASWAT BANK",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KVBL",
//       bankName: "KARUR VYSA BANK",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "JLSX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MYDT VIDISHA",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MHSX",
//       bankName: "MAHESH SAHAKARI BANK LTD PUNE",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BBRX",
//       bankName: "THE BANGALORE BANGALORE RURAL AND RAMANAGARA DCCB",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SPCX",
//       bankName: "THE SHIRPUR PEOPLES CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TGCX",
//       bankName: "TAMLUK GHATAL CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BDSX",
//       bankName: "THE BABASAHEB DESHMUKH SAHAKARI BANK LTD ATPADI",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JSEX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MARYADIT ,SEHORE",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "GSCB",
//       bankName: "THE GUJARAT STATE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "UTIB",
//       bankName: "AXIS BANK",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "MYSX",
//       bankName: "THE MYSORE CHAMARAJANAGAR DIST CO OP CEN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JSSX",
//       bankName: "JANATA SAHAKARI BANK LTD SATARA",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KBCX",
//       bankName: "THE KANAKAMAHALAKSHMI CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "RNSB",
//       bankName: "RAJKOT NAGARIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "APBL",
//       bankName: "THE ANDHRA PRADESH STATE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JKDX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MYDT JABALPUR",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MSNU",
//       bankName: "THE MEHSANA URBAN CO OP BANK",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KACE",
//       bankName: "THE KANGRA CENTRAL CO OP BANK LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "RATN",
//       bankName: "RBL BANK LIMITED",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "ZCBL",
//       bankName: "THE ZOROASTRIAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CIUB",
//       bankName: "CITY UNION BANK LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "JRAX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MARYADIT RATLAM",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NDCX",
//       bankName: "THE NILGIRIS DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "AIRP",
//       bankName: "AIRTEL PAYMENTS BANK LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SVAX",
//       bankName: "SRI VASAVAMBA CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MSNX",
//       bankName: "THE MEHSANA DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "YESB",
//       bankName: "YES BANK",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "KUMX",
//       bankName: "THE KUMBAKONAM CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BKDX",
//       bankName: "THE BANASKANTHA DIST CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "RSSX",
//       bankName: "RAJARSHI SHAHU SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KRNX",
//       bankName: "THE KARNAVATI CO OP  BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KANX",
//       bankName: "THE KANARA DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PPBX",
//       bankName: "PUNE PEOPLES CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TJCX",
//       bankName: "THANJAVUR CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KJSB",
//       bankName: "THE KALYAN JANATA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DBSS",
//       bankName: "DBS BANK INDIA LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JSBL",
//       bankName: "JANAKALYAN SAHAKARI BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JMBX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MARYADIT BETUL",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NCBL",
//       bankName: "THE NATIONAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NAWX",
//       bankName: "THE NAWANAGAR CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "EDCX",
//       bankName: "THE ERODE DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BHCX",
//       bankName: "THE BHUJ COMMERCIAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KBSX",
//       bankName: "KRISHNA BHIMA SAMRUDDHI LOCAL AREA BANK",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JSDX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MARYADIT,DHAR",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "RJTX",
//       bankName: "SHRI RAJKOT DISTRICT CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "QUCX",
//       bankName: "THE QUILON CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MHNX",
//       bankName: "MAHANAGAR NAGRIK SAHAKARI BANK MARYADIT",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PGBX",
//       bankName: "KARNATAKA GRAMIN BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JPAX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MYDT PANNA",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DICX",
//       bankName: "THE DISTRICT CO OP CENTRAL BANK LTD VISAKHAPATNAM",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TVPX",
//       bankName: "THE VERAVAL PEOPLES CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JMYX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MYDT DURG",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SBCX",
//       bankName: "THE SULTANS BATTERY CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TDIX",
//       bankName: "THE DISTRICT CO OP CENTRAL BANK LTD KAKINADA",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "WBSC",
//       bankName: "THE WEST BENGAL STATE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SVCX",
//       bankName: "SARVODAYA COMMERICAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JCHX",
//       bankName: "JILA SAHAKARI KENDRIYA BANK MARYADIT CHHATARPUR",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DHUX",
//       bankName: "THE DAHOD URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "COLX",
//       bankName: "COASTAL LOCAL AREA BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KKMX",
//       bankName: "KANKARIA MAINAGAR NAGRIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JIDX",
//       bankName: "JILA SAHKARI KENDRIYA BANK MYDT DAMOH",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "FGCB",
//       bankName: "FINGROWTH CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BSBX",
//       bankName: "THE BARAMATI SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "KMCX",
//       bankName: "KRISHNA MERCANTILE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KRCX",
//       bankName: "THE KOLAR AND CHICKBALLAPUR DT CO OP CENTRAL BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "USFB",
//       bankName: "UJJIVAN SMALL FINANCE BANK LTD",
//       netbankFlag: true,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: true,
//       custidFlag: true
//     },
//     {
//       bankId: "MPRX",
//       bankName: "MADHYA PRADESH RAJYA SAHAKARI BANK MARYADIT",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PANX",
//       bankName: "THE PANCHMAHAL DISTRICT CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: true,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TSDX",
//       bankName: "THE DISTRICT CO OP CENTRAL BANK LTD SRIKAKUL",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: true,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ABDX",
//       bankName: "DR AMBEDKAR NAGRIK SAHAKARI BANK MYDT GWALIOR",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ABHY",
//       bankName: "ABHYUDAYA CO OP BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ABSB",
//       bankName: "THE ABHINAV SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ABUX",
//       bankName: "ABHINANDAN URBAN CO OP BANK AMRAVATI",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ACBX",
//       bankName: "ADARSH CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ACKX",
//       bankName: "DR ANNASAHEB CHOUGULE URBAN CO OP BANK LT VADGAON",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ADCC",
//       bankName: "THE AKOLA WASHIM DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ADCX",
//       bankName: "SHRI ADINATH CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "AGCX",
//       bankName: "THE AGRASEN CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "AGSX",
//       bankName: "THE AGRASEN NAGARI SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "AGUX",
//       bankName: "AGARTALA CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "AHMX",
//       bankName: "THE AHMEDNAGAR DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "AHUX",
//       bankName: "AHILYADEVI URBAN CO OP BANK LTD SOLAPUR",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "AJKB",
//       bankName: "THE AKOLA JANATA COMMERCIAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "AJPX",
//       bankName: "AMBAJOGAI PEOPLES CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "AJSX",
//       bankName: "AMBARNATH JAI HIND CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ALAX",
//       bankName: "ALAVI CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ALLX",
//       bankName: "ALLAHABAD DISTRICT CENTRAL CO-OPERATIVE BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "AMAX",
//       bankName: "AMAN SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ANMX",
//       bankName: "THE AHMEDNAGAR MERCHANTS CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ANNX",
//       bankName: "SHRI ANAND NAGARI SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ANSX",
//       bankName: "ANDAMAN AND NICOBAR STATE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "APGX",
//       bankName: "ANDHRA PRADESH GRAMEENA VIKAS BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "APMX",
//       bankName: "THE AP MAHAJANS CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "APRR",
//       bankName: "THE A P RAJA RAJESWARI MAHILA COOP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "APSX",
//       bankName: "ADARNIYA P D PATILSAHEB SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ASBL",
//       bankName: "APNA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ASHX",
//       bankName: "THE ASHTA PEOPLES CO OP BANK LTD ASHTA",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ASKX",
//       bankName: "ARVIND SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "AUCX",
//       bankName: "THE AJARA URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "AVDX",
//       bankName: "THE AMRAVATI DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BACB",
//       bankName: "BASSEIN CATHOLIC CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BACX",
//       bankName: "THE BIHAR AWAMI CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BARX",
//       bankName: "THE BARODA CITY CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BASX",
//       bankName: "SHRI BASAVESHWAR SAHAKARI BANK NYT BAGALKOT",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BBLX",
//       bankName: "BHINGAR URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BCBM",
//       bankName: "BHARAT CO-OPERATIVE BANK (MUMBAI) LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BCBX",
//       bankName: "THE BANTRA CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BCUB",
//       bankName: "THE BICHOLIM URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BDUX",
//       bankName: "BANDA URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BGUX",
//       bankName: "THE BEGUSARAI CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BHAX",
//       bankName: "THE BHAGYODAYA CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BHDX",
//       bankName: "BHADOHI URBAN CO OP BANK LTD GYANPUR",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BHEX",
//       bankName: "BHEL EMPLOYEES CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BHJX",
//       bankName: "THE BHUJ MERCENTILE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BHMX",
//       bankName: "BRAHMADEODADA MANE SAHAKARI BANK LTD SOLAPUR",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BHSX",
//       bankName: "BHARATI SAHAKARI BANK LTD PUNE",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BHUX",
//       bankName: "BHILWARA URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BJUX",
//       bankName: "THE BIJNOR URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BKCX",
//       bankName: "THE BHAVASARA KSHATRIYA CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BMCB",
//       bankName: "BOMBAY MERCANTILE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BNBX",
//       bankName: "BETUL NAGRIK SAHAKARI BANK MYDT",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BNCX",
//       bankName: "BHATPARA NAIHATI CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BORX",
//       bankName: "THE BORAL UNION CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BRDX",
//       bankName: "THE BARODA CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BSTX",
//       bankName: "BASTI DISTRICT COOPERATIVE BANK LTD BASTI",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BTUX",
//       bankName: "BALOTRA URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BUGX",
//       bankName: "BARODA UP BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "BUZX",
//       bankName: "BADAUN ZILA SAHAKARI BANK LTD BUDAUN",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CALX",
//       bankName: "THE CALICUT CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CBHX",
//       bankName: "THE CENTRAL CO OP BANK LTD BHILWARA",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CCCX",
//       bankName: "CHENNAI CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CCMX",
//       bankName: "THE CHANASMA COMMERCIAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CHBX",
//       bankName: "THE CHAMBA URBAN CO OP BANK LTD CHAMBA",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CHPX",
//       bankName: "THE CHOPDA PEOPLES CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CHTX",
//       bankName: "THE CHITNAVISPURA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CITI",
//       bankName: "CITIBANK N A",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CJAX",
//       bankName: "THE CITIZENS CO OP BANK LTD JAMMU",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CJMX",
//       bankName: "KARNATAKA MAHILA SAHAKARA BANK NIYAMITHA",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CMLX",
//       bankName: "THE COMMERCIAL CO OP BANK LTD JAMNAGAR",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CMSV",
//       bankName: "CHAITANYA MAHILA SAHAKARI BANK LTD VIJAYAPUR",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "COCX",
//       bankName: "THE CO OP CITY BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CRUB",
//       bankName: "SHRI CHHATRAPATI RAJARSHI SHAHU URBAN CO OP BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CSBX",
//       bankName: "CHARTERED SAHAKARI BANK NIYAMITHA",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CTBX",
//       bankName: "CITIZENS CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CZCX",
//       bankName: "CITIZEN CO OP BANK LTD NOIDA",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "CZUX",
//       bankName: "CHURU ZILA URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DAHX",
//       bankName: "THE DAHOD MERCANTILE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DBAX",
//       bankName: "DR BABASAHEB AMBEDKAR SAHAKARI BANK LTD NASIK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DDBX",
//       bankName: "DHARMAPURI DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DENS",
//       bankName: "DELHI NAGRIK SEHKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DHSX",
//       bankName: "THE DAVANAGERE HARIHARA URBAN SAHAKARA BANK NIYAMI",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DNSB",
//       bankName: "DOMBIVILI NAGARI SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DOBX",
//       bankName: "DAPOLI URBAN CO OP BANK LTD DAPOLI",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DSCB",
//       bankName: "THE DELHI STATE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DSPX",
//       bankName: "DURGAPUR STEEL PEOPLES CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DSUX",
//       bankName: "DHARAMVIR SAMBHAJI URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "DTCX",
//       bankName: "DISTRICT CO OP BANK LTD RAEBARELI",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "EUCX",
//       bankName: "ETAH URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "FINX",
//       bankName: "THE FINANCIAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "GACX",
//       bankName: "GUJARAT AMBUJA CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "GCBX",
//       bankName: "THE GURUVAYUR CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "GHPX",
//       bankName: "THE GHATAL PEOPLES CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "GMBX",
//       bankName: "THE GANDHIDHAM MERCANTILE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "GNCX",
//       bankName: "THE GANDHI CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "GNSX",
//       bankName: "THE GOZARIA NAGRIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "GNUX",
//       bankName: "SRI GANAPATHI URBAN COOPERATIVE BANK LIMITED",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "GPCX",
//       bankName: "THE GANDEVI PEOPLES CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "GRAX",
//       bankName: "THE GRAIN MERCHANTS CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "GSBX",
//       bankName: "GANDHIBAG SAHAKARI BANK LTD NAGPUR",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "GUNX",
//       bankName: "THE GUNTUR CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "HAMX",
//       bankName: "HAMIRPUR DISTRICT CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "HGBX",
//       bankName: "SARVA HARYANA GRAMIN BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "HMNX",
//       bankName: "HIMATNAGAR NAGARIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "HNSX",
//       bankName: "THE HARIJ NAGRIK SAHAKARI BANK LTD HARIJ",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "HPCX",
//       bankName: "SHREE PARSWANATH CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "HSDX",
//       bankName: "THE HASSAN DISTRICT CO OP CENTRAL BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "HUCH",
//       bankName: "HANAMASAGAR URBAN CO OP BANK LTD HANAMASAGAR",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ICBL",
//       bankName: "THE INDUSTRIAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ICMX",
//       bankName: "INDORE CLOTH MARKET CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "IMPX",
//       bankName: "THE IMPHAL URBAN CO OP BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ISMX",
//       bankName: "INDORE SWAYAM MAHILA CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ITCX",
//       bankName: "IRINJALAKUDA TOWN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ITDX",
//       bankName: "THE INCOME TAX DEPT CO OP BANK LTD MUMBAI",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JASB",
//       bankName: "JANASEVA SAHAKARI BANK BORIVLI LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JCDX",
//       bankName: "THE JAMNAGAR DISTRICT CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JHAX",
//       bankName: "JHARNESHWAR NAGRIK SAHAKARI BANK MARYADIT",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JKSX",
//       bankName: "THE J AND K STATE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JLNX",
//       bankName: "THE JALNA PEOPLES CO OP BANK LTD JALNA",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JMHX",
//       bankName: "JAMSHEDPUR URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JMNX",
//       bankName: "JABALPUR MAHILA NAGRIK SAHKARI BANK MARYADIT",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JMPX",
//       bankName: "THE JAMNAGAR PEOPLES CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JODX",
//       bankName: "THE JODHPUR CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JSMX",
//       bankName: "JANATA SAHAKARI BANK LTD AMRAVATI",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "JVCX",
//       bankName: "JIVAN COMMERCIAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KALX",
//       bankName: "THE KALNA TOWN CREDIT CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KAMX",
//       bankName: "KAMALA CO OP BANK LTD SOLAPUR",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KCCX",
//       bankName: "KANCHEEPURAM CENTRAL CO OP BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KCUB",
//       bankName: "THE KHATTRI CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KCUX",
//       bankName: "THE KANNUR CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KHDX",
//       bankName: "THE KHEDA PEOPLES CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KHUX",
//       bankName: "THE KHAMGAON URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KMSX",
//       bankName: "KOLHAPUR MAHILA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KOBX",
//       bankName: "THE KOPARGAON PEOPLES CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KOYX",
//       bankName: "THE KOYLANCHAL URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KPCX",
//       bankName: "KOLHAPUR DIST CENTRAL CO OP BANK LTD KOLHAPUR",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KRTX",
//       bankName: "THE KRANTHI CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KSCB",
//       bankName: "THE KARNATAKA STATE CO OP APEX BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KSUX",
//       bankName: "KASHIPUR URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KUCX",
//       bankName: "THE KOLHAPUR URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KVCX",
//       bankName: "KAVITA URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "KVGB",
//       bankName: "KARNATAKA VIKAS GRAMEENA BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "LATX",
//       bankName: "THE LATUR URBAN CO OP BANK LTD LATUR",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "LBMX",
//       bankName: "LAXMIBAI MAHILA NAGRIK SAHAKARI BANK MARADIT",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "LCCX",
//       bankName: "THE LUDHIANA CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "LDPX",
//       bankName: "LOKNETE DATTAJI PATIL SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "LKMX",
//       bankName: "LOKMANGAL CO OP BANK LTD SOLAPUR",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "LOKX",
//       bankName: "LOKVIKAS NAGARI SAHAKARI BANK LTD AURANGABAD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MABL",
//       bankName: "THE MALLESHWARAM CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MAKX",
//       bankName: "THE MAKARPURA INDUSTRIAL ESTATE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MALX",
//       bankName: "MALVIYA URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MCBX",
//       bankName: "THE MODERN CO-OP BANK LTD, CHALISGAON",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MCSX",
//       bankName: "THE MATTANCHERRY SARVAJANIK CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MDEX",
//       bankName: "MODEL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MDIX",
//       bankName: "MANDYA DISTRICT CO OP CENTRAL BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MGCB",
//       bankName: "THE MOGAVEERA CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MGCX",
//       bankName: "MANSING CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MKYX",
//       bankName: "MARKETYARD COMMERCIAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MLCG",
//       bankName: "THE MERCHANTS LIBERAL COOP BANK LTD GADAG",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MMMX",
//       bankName: "MAHILA NAGRIK SAHAKARI BANK MARYADIT MAHASAMUND",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MPCX",
//       bankName: "THE MOIRANG PRIMARY CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MPDX",
//       bankName: "THE MALAPPURAM DISTRICT CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MRTX",
//       bankName: "MARATHA CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MSAX",
//       bankName: "MANSAROVAR URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MSBL",
//       bankName: "THE MALAD SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MSCI",
//       bankName: "MAHARASHTRA STATE CO-OPERATIVE BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MSCX",
//       bankName: "THE MANIPUR STATE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MSOX",
//       bankName: "MANORAMA CO OP BANK LTD SOLAPUR",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MSSX",
//       bankName: "THE MERCHANTS SOUHARDA SAHAKARA BANK N",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MUDX",
//       bankName: "MADHESHWARI URBAN DEVELOPMENT CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MUPX",
//       bankName: "THE MEHMADABAD URBAN PEOPLES CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MVCX",
//       bankName: "THE MAHAVEER CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MVIX",
//       bankName: "MANVI PATTANA SOUHARDA SAHAKARI BANK NI",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "MZCX",
//       bankName: "MIZORAM URBAN CO OP DEVELOPMENT BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NAIX",
//       bankName: "NAINITAL DISTRICT CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NASX",
//       bankName: "NASIK DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NAVX",
//       bankName: "THE NAVNIRMAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NBMX",
//       bankName: "NAGRIK SAHAKARI BANK MARYADHIT VIDISHA",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NBSX",
//       bankName: "NAVSARJAN INDUSTRIAL CO OPERATIVE BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NCCX",
//       bankName: "THE NABADWIP CO OP CREDIT BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NGRX",
//       bankName: "NAGAR SAHKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NGSX",
//       bankName: "NAGARIK SAHAKARI BANK MARYADIT DURG",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NILX",
//       bankName: "NEELKANTH CO OP BANK LTD SOLAPUR",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NJGX",
//       bankName: "MADHYA PRADESH GRAMIN BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NJSX",
//       bankName: "THE NASIK JILHA MAHILA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NMCB",
//       bankName: "THE NASIK MERCHANTS CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NMNX",
//       bankName: "NAGPUR MAHANAGARPALIKA KARMACHARI SAHAKARI BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NSBB",
//       bankName: "NAGARIK SAHAKARI BANK LTD BHIWANDI",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NSBX",
//       bankName: "NAGRIK SAHAKARI BANK LTD LUCKNOW",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NTBL",
//       bankName: "THE NAINITAL BANK LIMITED",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "NVSX",
//       bankName: "NAGAR VIKAS SAHKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ODGB",
//       bankName: "ODISHA GRAMYA BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "OIBA",
//       bankName: "DOHA BANK QSC",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "OMCX",
//       bankName: "THE OJHAR MERCHANTS CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ONSX",
//       bankName: "OMKAR NAGREEYA SAHKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "OSMX",
//       bankName: "OSMANABAD JANATA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PALX",
//       bankName: "PALI URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PASX",
//       bankName: "PASCHIM BANGA GRAMIN BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PCBL",
//       bankName: "PATAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PCSX",
//       bankName: "THE PUDUCHERRY STATE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PCTX",
//       bankName: "PUNE CANTONMENT SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PDUX",
//       bankName: "THE PANDHARPUR URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PGCX",
//       bankName: "PROGRESSIVE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PGUX",
//       bankName: "THE PRAGATI URBAN CO OP BANK LTD MANMAD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PJSB",
//       bankName: "GP PARSIK SAHAKARI BANK LTD KALWA THANE",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PLUX",
//       bankName: "PALUS SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PMNX",
//       bankName: "PRAGATI MAHILA NAGRIK SAHAKARI BANK LTD BHILAI",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PNSX",
//       bankName: "POORNAWADI NAGRIK SAHAKARI BANK M BEED",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PNVX",
//       bankName: "PANVEL CO OPERATIVE URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PRPX",
//       bankName: "PARASPAR SAHAYAK CO OP BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PSBX",
//       bankName: "PRAGATI SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PSCX",
//       bankName: "THE PUNJAB STATE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PSSX",
//       bankName: "THE PRATHAMIK SHIKSHAK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PTCX",
//       bankName: "THE PATIALA CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PTNX",
//       bankName: "THE PATAN URBAN CO OP BANK LTD PATAN",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PTSX",
//       bankName: "PATAN NAGARIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "PUBX",
//       bankName: "PEOPLES URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "RAKX",
//       bankName: "RAJKOT PEOPLES CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "RBBX",
//       bankName: "RAJARAMBAPU SAHAKARI BANK LTD PETH",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "RCCX",
//       bankName: "THE ROPAR CENTRAL CO OP BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "RCUX",
//       bankName: "RAJADHANI CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "RDNX",
//       bankName: "COL RD NIKAM SAINIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "REBX",
//       bankName: "RENDAL SAHAKARI BANK LTD RENDAL",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "RECX",
//       bankName: "RAILWAY EMPLOYEES CO OP BANKING SOCIETY LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "RGSX",
//       bankName: "RAJGURUNAGAR SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "RNBX",
//       bankName: "THE RANUJ NAGRIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "RRSX",
//       bankName: "RAMRAJYA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "RUKX",
//       bankName: "SHRI RUKMINI SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "RZSX",
//       bankName: "RAMPUR ZILA SAHKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SAGX",
//       bankName: "SAURASHTRA GRAMIN BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SAHX",
//       bankName: "SADHANA SAHAKARI BANK LTD PUNE",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SAIX",
//       bankName: "SANMITRA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SASA",
//       bankName: "THE SAHYADRI SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SATX",
//       bankName: "ADV SHAMRAOJI SHINDE SATYASHODHAK BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SBMX",
//       bankName: "SRI BANASHANKARI MAHILA CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SBNX",
//       bankName: "SHREE BHAVNAGAR NAGRIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SBPX",
//       bankName: "SBPP CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SBUJ",
//       bankName: "SHRI BHARAT URBAN CO OP BANK LTD JAYSINGPUR",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SBUX",
//       bankName: "SHREE BALAJI URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SCNX",
//       bankName: "SHRI CHHANI NAGRIK SAHKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SCSX",
//       bankName: "SREE CHARAN SOUHARDHA CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SCUX",
//       bankName: "SUDHA CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SDCX",
//       bankName: "SINDHUDURG DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SDHX",
//       bankName: "SOLAPUR SIDDHESHWAR SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SDSX",
//       bankName: "SATARA DISTRICT CENTRAL CO-OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SENX",
//       bankName: "SEHORE NAGRIK SAHAKARI BANK LTD SEHORE",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SEUX",
//       bankName: "THE SEVALIA URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SGSX",
//       bankName: "SADGURU NAGRIK SAHAKARI BANK MARYADIT",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SHCX",
//       bankName: "THE SHIMLA URBAN COOP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SHRX",
//       bankName: "SHREE MAHESH CO OP BANK LTD NASHIK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SHSX",
//       bankName: "SHARAD SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SIRX",
//       bankName: "THE SIRCILLA CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SISX",
//       bankName: "SANMATI SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SITX",
//       bankName: "THE SITAMARHI CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SKCX",
//       bankName: "SHRIKRISHNA CO OP BANK LTD UMRER",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SKUX",
//       bankName: "S S L S A KURUNDWAD URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SMNX",
//       bankName: "SHREE MAHUVA NAGRIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SMUX",
//       bankName: "SHRI MAHAVIR URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SNAX",
//       bankName: "SARASPUR NAGARIK CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SNBX",
//       bankName: "THE SARVODAYA NAGRIK SAHKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SNCX",
//       bankName: "THE SONEPAT URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SNDX",
//       bankName: "THE SIND CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SNGX",
//       bankName: "THE SARANGPUR CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SNKX",
//       bankName: "SHARMIK NAGRIK SAHAKARI BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SNPX",
//       bankName: "THE SONEPAT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SONX",
//       bankName: "SONBHADRA NAGAR SAHKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SPBX",
//       bankName: "SAPTAGIRI GRAMEENA BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SPSX",
//       bankName: "SANDUR PATTANA SOUHARDA SAHAKARI BANK NIYAMITHA",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SRCX",
//       bankName: "SHREE BHARAT CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SSBX",
//       bankName: "SHIVDAULAT SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SSDX",
//       bankName: "SUCO SOUHARDA SAHAKARI BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SSJX",
//       bankName: "SAMARTH SAHAKARI BANK MARYADIT JALNA",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SSKX",
//       bankName: "SADHANA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SSLX",
//       bankName: "THE SOLAPUR SOCIAL URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SUCX",
//       bankName: "SANGLI URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SULX",
//       bankName: "SULAIMANI CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SUMX",
//       bankName: "THE SURAT MERCANTILE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SUSB",
//       bankName: "SADALGA URBAN SOUHARDA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SUTB",
//       bankName: "THE SUTEX CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SUVX",
//       bankName: "SUVARNAYUG SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "SVSX",
//       bankName: "SHRI VINAYAK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TACX",
//       bankName: "THE ADINATH CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TAMX",
//       bankName: "THE ANAND MERCANTILE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TBEX",
//       bankName: "THE BANK EMPLOYEES CO OPERATIVE BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TBMX",
//       bankName: "THE BAPUNAGAR MAHILA CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TBOX",
//       bankName: "THE BODELI URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TBSX",
//       bankName: "THE BIHAR STATE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TCNX",
//       bankName: "THE CHANASMA NAGRIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TCUB",
//       bankName: "THE TRIVANDRUM CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TDCB",
//       bankName: "THE THANE DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TDMX",
//       bankName: "THE DHANERA MERCANTILE CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TEHX",
//       bankName: "TEHRI GARHWAL ZILA SAHKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TGMB",
//       bankName: "TUMKUR GRAIN MERCHANTS CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TGUX",
//       bankName: "THE GANDHINAGAR URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "THOX",
//       bankName: "THE THOOTHUKUDI DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TIRX",
//       bankName: "THE TIRUNELVELI DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TJNX",
//       bankName: "THE JAMNAGAR MAHILA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TJSB",
//       bankName: "TJSB SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TJUX",
//       bankName: "THE JHALOD URBAN COOPERATIVE BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TLPX",
//       bankName: "THE LUNAWADA PEOPLES CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TMSX",
//       bankName: "THE MODASA NAGARIK SAHKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TNBX",
//       bankName: "THE MEGHRAJ NAGARIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TNKX",
//       bankName: "THE NEELA KRISHNA CO OP URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TNMX",
//       bankName: "THE NANDED MERCHANTS CO OP BANK LTD NANDED",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TPBX",
//       bankName: "THE PRATAP COOP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TPLX",
//       bankName: "THE PALGHAT COOPERATIVE URBAN BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TRSX",
//       bankName: "THE RADDI SAHAKARA BANK NIYAMITHA DHARWAD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TSVX",
//       bankName: "THE SARVODAYA SAHAKARI BANK LTD MODASA",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TTLX",
//       bankName: "TEXTILE CO-OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TTUX",
//       bankName: "THE TIRUR URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TUCL",
//       bankName: "THE UNION CO OP BANK LTD MAHINAGAR",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TUMX",
//       bankName: "THE UDAIPUR MAHILA URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TUNX",
//       bankName: "THE UNION CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "TUOX",
//       bankName: "THE URBAN CO OP BANK LTD SAHARANPUR",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "UBBX",
//       bankName: "URBAN CO OP BANK LTD BASTI",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "UBGX",
//       bankName: "UTTAR BIHAR GRAMIN BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "UCCX",
//       bankName: "THE UDAIPUR CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "UCDX",
//       bankName: "URBAN CO OP BANK LTD DEHRADUN",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "UDVX",
//       bankName: "UDYAM VIKAS SAHAKARI BANK LTD. PUNE",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "UMAX",
//       bankName: "UMA CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "UNIX",
//       bankName: "THE UNITED CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "UNSX",
//       bankName: "THE UNAVA NAGRIK SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "UPCX",
//       bankName: "UTTAR PRADESH CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "UROX",
//       bankName: "THE URBAN CO OP BANK LTD ROURKELA",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "VAIX",
//       bankName: "VAISHYA SAHAKARI BANK LTD MUMBAI",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "VCAX",
//       bankName: "THE VAISH CO OP ADARSH BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "VCBX",
//       bankName: "VISHWAS CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "VCCX",
//       bankName: "SHRI VEERSHAIV CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "VCNB",
//       bankName: "THE VAISH CO OP NEW BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "VDYX",
//       bankName: "VIDYANAND CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "VICX",
//       bankName: "VIJAY COMMERCIAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "VIKX",
//       bankName: "VIKRAMADITYA NAGRIK SAHAKARI BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "VJSX",
//       bankName: "VASAI JANATA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "VSBX",
//       bankName: "VIDYA SAHAKARI BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "VSCX",
//       bankName: "VIKAS SOUHARDA CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "VUCX",
//       bankName: "THE VAIDYANATH URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "WAIX",
//       bankName: "THE WAI URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "WKGX",
//       bankName: "VIDHARBHA KONKAN GRAMIN BANK",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "WRCX",
//       bankName: "WARANGAL URBAN CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "XJKG",
//       bankName: "J AND K GRAMEEN BANK ACH",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "YADX",
//       bankName: "YAVATMAL DISTRICT CENTRAL CO OP BANK LTD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "YAVX",
//       bankName: "THE YAVATMAL URBAN CO OP BANK LTD YAVATMAL",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ZLGX",
//       bankName: "ZILA SAHKARI BANK LTD GHAZIPUR",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ZRNB",
//       bankName: "RANI CHANNAMMA MAHILA SAHAKARI BANK NIYAMT BELGAVI",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ZSBL",
//       bankName: "ZILA SAHKARI BANK LTD GHAZIABAD",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ZSHX",
//       bankName: "ZILA SAHAKARI BANK LTD HARIDWAR",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     },
//     {
//       bankId: "ZSMX",
//       bankName: "ZILA SAHAKARI BANK LTD MEERUT",
//       netbankFlag: false,
//       cardFlag: false,
//       adharFlag: false,
//       panFlag: false,
//       custidFlag: false
//     }
//   ]
// }



export { paymentType, notifyItems, steperItems, houseTypeOptions, genderOptions, maritalStatusOptions, features, leadRemarks, actionType, branchList, assignStatus, kycStatus, disbursalStatus, emiStatus, collectionStatus, manageApp, qcStatus, leadStatus, creditApprovalStatus, creditApprovalRemarks, loanStatus, collectionPaymentMode, relationOptions, userStatus, userRole, nameTitle, assessmentRemarks, paymentMode, educationOptions, emplyeeType, productType, repaymentFrequency, loanTenure, interestType, scorePlatform, documentType, emiStaus, leadStep1, rejectLead, eKYCRemarks, disbursedRemarks, addRemarkOptions, exportDataType, exportLeadSource, exportStatusSource, exportCollectionSource, disburesementMode };
