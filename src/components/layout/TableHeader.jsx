import ExportBtn from '../utils/ExportBtn';

const TableHeader = ({ heading, data, fileName }) => (
    <div className='flex justify-between mb-5'>
        <h1 className="text-2xl font-bold text-black">{heading}</h1>
        <ExportBtn data={data} fileName={fileName} />
    </div>
);

export default TableHeader;
