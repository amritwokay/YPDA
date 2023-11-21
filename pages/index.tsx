import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { vs, dracula } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import ThemeButton from "../components/ThemeButton";
import { useTranslate } from "../hooks/useTranslate";
import { toast } from "react-hot-toast";
import LoadingDots from "../components/LoadingDots";
import { useTheme } from "next-themes";
import Toggle from "../components/Toggle";
import { Header } from "../components/Header/Header";

interface TableRowData {
  [key: string]: {
    S: string;
  };
}
interface TableData {
  [key: string]: TableRowData;
}
interface Props {
  jsonText: string;
}
const JSONTable: React.FC<Props> = ({ jsonText }) => {
  const data: TableData[] = JSON.parse(jsonText);
  const getHeaders = (): string[] => {
    if (data.length === 0) return [];
    return Object.keys(data[0]);
  };
  const getRows = (): JSX.Element[] => {
    return data.map((rowData, index) => {
      const rowId = `row-${index}`;
      const columns = Object.entries(rowData);
      return (
        <tr key={rowId}>
          {columns.map(([columnKey, columnData]) => {
            const columnId = `column-${columnKey}`;
            const value = columnData.S;
            return <td key={columnId}>{String(value)}</td>;
          })}
        </tr>
      );
    });
  };
  return (
    <table className="border-collapse border border-gray-300">
      <thead>
        <tr>
          {getHeaders().map((header, index) => (
            <th key={index} className="border border-gray-300 p-2">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{getRows().map((row, index) => (
        <tr key={index}>
          {row.props.children.map((cell: { props: { children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }; }, index: React.Key | null | undefined) => (
            <td key={index} className="border border-gray-300 p-2">
              {cell.props.children}
            </td>
          ))}
        </tr>
      ))}</tbody>
    </table>
  );}

const SyntaxHighlighter = dynamic(() => import("react-syntax-highlighter"));

interface IHistory {
  inputText: string;
  outputText: string;
  tableSchema?: string;
  isHumanToSql?: boolean;
}

interface IHistoryEntry {
  inputText: string;
  outputText: string;
  tableSchema?: string;
  isHumanToSql?: boolean;
}

interface ITextCopied {
  isCopied: boolean;
  isHistory: boolean;
  text: string;
}
interface prev{
  previnput: string;
  prevoutput: string;
}

export default function Home() {
  
  const { resolvedTheme } = useTheme();
  const isThemeDark = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);
  const {
    translate,
    translating,
    outputText,
    setOutputText,
    translationError,
  } = useTranslate();
  const [inputText, setInputText] = useState("");
  const [prevquery, setPrevquery] = useState<prev[]>([]);
  const [isHumanToSql, setIsHumanToSql] = useState(true);
  const [isOutputTextUpperCase, setIsOutputTextUpperCase] = useState(false);
  const [tableSchema, setTableSchema] = useState("");
  const [showTableSchema, setShowTableSchema] = useState(false);
  const [history, setHistory] = useState<IHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [hasTranslated, setHasTranslated] = useState(false);
  const [copied, setCopied] = useState<ITextCopied>();

  useEffect(() => {
    if (inputText && hasTranslated) {
      setHistory((prevHistory) => [
        ...prevHistory,
        {
          inputText: JSON.stringify(inputText),
          outputText: JSON.stringify(outputText),
          tableSchema,
          isHumanToSql,
        },
      ]);

      addHistoryEntry({
        inputText: JSON.stringify(inputText),
        tableSchema,
        isHumanToSql,
        outputText: JSON.stringify(outputText),
      });

      setHasTranslated(false);
    }
  }, [outputText]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (translationError) toast.error(translationError);
  }, [translationError]);

  if (!mounted) {
    return null;
  }

  const isValidTableSchema = (text: string) => {
    const pattern = /^CREATE\s+TABLE\s+\w+\s*\((\s*.+\s*,?\s*)+\);?$/i;
    const regex = new RegExp(pattern);
      return regex.test(text.trim());
  };

  const addHistoryEntry = (entry: IHistory) => {
    if (
      !history.some(
        ({ inputText, outputText }) =>
          inputText === entry.inputText && outputText === entry.outputText
      ) &&
      !prevquery.some(
        ({ previnput, prevoutput }) =>
          previnput === entry.inputText && prevoutput === entry.outputText
      )
    ) {
      setHistory([...history, entry]);
      
    }
    const newhistory: prev = {previnput : entry.inputText, prevoutput : entry.outputText};
    setPrevquery([...prevquery,newhistory]);
    
  };

  function safeJSONParse(str: string) {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.error("JSON parse error:", e);
      return null;
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
    if (!showTableSchema) {
      setTableSchema("CREATE TABLE superstore (RowID INT,OrderID INT,OrderDate DATE,ShipDate DATE,ShipMode VARCHAR(255),CustomerID INT,CustomerName VARCHAR(255),Segment VARCHAR(255),Country VARCHAR(255),City VARCHAR(255),State VARCHAR(255),PostalCode VARCHAR(255),Region VARCHAR(255),ProductID INT,Category VARCHAR(255),SubCategory VARCHAR(255),Sales DECIMAL(10, 2),Quantity INT,Discount DECIMAL(5, 2),Profit DECIMAL(10, 2));");
    }
  };

  const handleCopy = (text: string, isHistory: boolean) => {
    navigator.clipboard.writeText(text);
    setCopied({
      isCopied: true,
      isHistory: isHistory,
      text: text
    })
     setTimeout(() => {
      setCopied({
        isCopied: false,
        isHistory: isHistory,
        text: text
      }) 
    }, 3000);
  };

  const buttonStyles = {
    light: "light-button-w-gradient-border text-black",
    dark: "dark-button-w-gradient-border text-[#D8D8D8]",
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Validate input syntax
      if (!isHumanToSql) {
        const pattern =
          /^\s*(select|insert|update|delete|create|alter|drop|truncate|grant|revoke|use|begin|commit|rollback)\s/i;
        const regex = new RegExp(pattern);
        if (!regex.test(inputText)) {
          toast.error("Invalid SQL syntax.");
          return;
        }
      }
      if (showTableSchema && !isValidTableSchema(tableSchema)) {
        toast.error("Invalid table schema.");
        return;
      }

      translate({ inputText, tableSchema, isHumanToSql });
      setHasTranslated(true);
    } catch (error) {
      console.log(error);
      toast.error(`Error translating ${isHumanToSql ? "to SQL" : "to human"}.`);
    }
  };

  return (
    <div>
      <Header />
      <ThemeButton className="absolute top-2.5 left-2.5 text-gray-500 dark:text-gray-400 focus:outline-none hover:scale-125 transition" />
      
      <div className="flex flex-col md:flex-row w-full gap-6 bg-[#EEEEEE] dark:text-white dark:bg-black dark:border dark:border-white/20 rounded-2xl p-2">
        <div className="w-full" >
          <form
            onSubmit={(event) => handleSubmit(event)}
            className="rounded-xl bg-white border dark:border-gray-800 dark:bg-custom-gray shadow-md p-6 w-full h-full"
          >
            <div className="flex flex-col h-full">
              <label
                htmlFor="inputText"
                className="block font-medium mb-2 text-gray-700 dark:text-gray-200"
              >
                {isHumanToSql ? "Ask Me" : "SQL"}
              </label>
              <textarea
                className={`appearance-none border-0 rounded-lg w-full py-2 px-3 bg-custom-gray-bg dark:bg-custom-dark-gray text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline ${
                  isThemeDark ? "placeholder-dark" : ""
                }`}
                id="inputText"
                rows={3}
                placeholder={
                  isHumanToSql
                    ? "e.g. show me the profits for year 2015"
                    : "SELECT * FROM cars WHERE color = 'red'"
                }
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    (event.metaKey || event.ctrlKey)
                  ) {
                    handleSubmit(event);
                  }
                }}
                required
              />
              {tableSchema && showTableSchema && (
                <div className="mt-4">
                  <h2 className="mb-2 font-medium text-sm text-gray-500 dark:text-white">
                    Table Schema
                  </h2>
                  <SyntaxHighlighter
                    language="sql"
                    style={isThemeDark ? dracula : vs}
                    wrapLines={true}
                    showLineNumbers={true}
                    lineNumberStyle={{ color: isThemeDark ? "gray" : "#ccc" }}
                    customStyle={{
                      maxHeight: "none",
                      height: "auto",
                      overflow: "visible",
                      wordWrap: "break-word",
                      color: "inherit",
                      backgroundColor: isThemeDark ? "#1D1D1D" : "#F8F8F8",
                      borderRadius: "0.5rem",
                    }}
                    lineProps={{ style: { whiteSpace: "pre-wrap" } }}
                  >
                    {tableSchema}
                  </SyntaxHighlighter>
                </div>
              )}

              <div className="flex items-center justify-between my-3 last:mb-0 space-x-10">
                {isHumanToSql && (
                  <button
                    type='button'
                    className={`rounded-full flex items-center justify-center space-x-4 border text-sm font-medium px-4 py-2 [text-shadow:0_0_1px_rgba(0,0,0,0.25)] ${
                      resolvedTheme === "light"
                        ? buttonStyles.light
                        : buttonStyles.dark
                    }`}
                    onClick={() => {
                      setShowTableSchema(!showTableSchema);
                      if (!showTableSchema) {
                        setTableSchema("CREATE TABLE superstore (RowID INT,OrderID INT,OrderDate DATE,ShipDate DATE,ShipMode VARCHAR(255),CustomerID INT,CustomerName VARCHAR(255),Segment VARCHAR(255),Country VARCHAR(255),City VARCHAR(255),State VARCHAR(255),PostalCode VARCHAR(255),Region VARCHAR(255),ProductID INT,Category VARCHAR(255),SubCategory VARCHAR(255),Sales DECIMAL(10, 2),Quantity INT,Discount DECIMAL(5, 2),Profit DECIMAL(10, 2));");
                      }
                    }}
                  >
                    {showTableSchema ? "Hide Schema" : "View Schema"}
                  </button>
                )}

                <button
                  type="submit"
                  className={`cursor-pointer py-2 px-4y rounded-full blue-button-w-gradient-border [text-shadow:0_0_1px_rgba(0,0,0,0.25)] shadow-2xl flex flex-row items-center justify-start ${
                    translating && "opacity-50 pointer-events-none"
                  }`}
                  disabled={translating}
                >
                  <img src="/stars.svg"></img>&nbsp;
                  <div className="relative text-sm font-semibold font-inter text-white text-center inline-block mx-auto">
                    {translating ? (
                      <>
                        Retrieveing Data
                        <LoadingDots color="white" />
                      </>
                    ) : (
                      `Generate Result`
                    )}
                  </div>
                </button>
              </div>

              {isHumanToSql && showTableSchema && (
                <div className="flex flex-col mt-2">
                  <label
                    htmlFor="tableSchema"
                    className="block mb-2 text-sm font-medium text-gray-500 dark:text-white"
                  >
                    Table Schema Input
                  </label>
                  <textarea
                    className={`appearance-none border-0 rounded-lg w-full py-2 px-3 bg-custom-gray-bg dark:bg-custom-dark-gray text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline ${
                      isThemeDark ? "placeholder-dark" : ""
                    }`}
                    id="tableSchema"
                    rows={3}
                    //placeholder="e.g. CREATE TABLE cars (id INT, make TEXT, model TEXT, year INT, color TEXT)"
                    value={tableSchema}
                    autoFocus
                    onChange={(event) => setTableSchema(event.target.value)}
                    onBlur={() => {
                      if (!showTableSchema) {
                        setTableSchema("CREATE TABLE superstore (RowID INT,OrderID INT,OrderDate DATE,ShipDate DATE,ShipMode VARCHAR(255),CustomerID INT,CustomerName VARCHAR(255),Segment VARCHAR(255),Country VARCHAR(255),City VARCHAR(255),State VARCHAR(255),PostalCode VARCHAR(255),Region VARCHAR(255),ProductID INT,Category VARCHAR(255),SubCategory VARCHAR(255),Sales DECIMAL(10, 2),Quantity INT,Discount DECIMAL(5, 2),Profit DECIMAL(10, 2));");
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </form>
        </div>
        <div className="w-full">
          <div className="rounded-xl bg-white border dark:border-gray-800 dark:bg-custom-gray shadow-md p-6 w-full h-full" style={{ width: '100%' }}>
            <div className="flex flex-col flex-1">
              <label
                htmlFor="Result"
                className="block font-medium mb-2 text-gray-700 dark:text-gray-200"
              >
                Dataset Description
              </label>
              <div
                className={`${
                isThemeDark ? "text-white" : "text-black"
                } whitespace-pre-wrap`}
                >
                  You are “interacting” with Superstore dataset (from 2014-2017) to gain insights on the sales and Profit & Loss associated with products spanning across different regions and customer segments in US.
              </div>
              <div>Click on "View Schema" to get an overview about the definition of the dataset to frame your questions in natural language </div>
            </div>
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <button
          className={`rounded-full flex items-center justify-center space-x-4 border text-sm font-medium mt-2 mb-2 px-4 py-2 [text-shadow:0_0_1px_rgba(0,0,0,0.25)] ${
            resolvedTheme === "light" ? buttonStyles.light : buttonStyles.dark
          }`}
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? "Hide Result" : "Show Result"}
        </button>
      )}

      {showHistory && (
        <>
          {history.length > 0 && 
           [...history].reverse().map((entry: IHistoryEntry, index: number) => (
              <div key={index} className="w-full mb-6">
                <div className="flex flex-col md:flex-row w-full gap-6 bg-custom-background bg-gray-100 dark:bg-black dark:border-gray-800 border rounded-3xl from-blue-500 p-3">
                  <div className="w-full">
                    <div className="rounded-xl bg-white border dark:border-gray-800 dark:bg-custom-gray shadow-md p-6 w-full h-full">
                      <label
                        htmlFor="inputText"
                        className="block mb-2 text-gray-300"
                      >
                        {entry.isHumanToSql ? "Your Input" : "SQL"}
                      </label>
                      {entry.isHumanToSql ? (
                        <div
                          className={`${
                            isThemeDark ? "text-white" : "text-black"
                          } whitespace-pre-wrap`}
                        >
                          {safeJSONParse(entry?.inputText)}
                        </div>
                      ) : (
                        <SyntaxHighlighter
                          language="sql"
                          style={isThemeDark ? dracula : vs}
                          wrapLines={true}
                          showLineNumbers={true}
                          lineNumberStyle={{
                            color: isThemeDark ? "gray" : "#ccc",
                          }}
                          customStyle={{
                            minHeight: "70px",
                            maxHeight: "none",
                            height: "auto",
                            overflow: "visible",
                            wordWrap: "break-word",
                            color: "inherit",
                            backgroundColor: isThemeDark
                              ? "#1D1D1D"
                              : "#F8F8F8",
                          }}
                          lineProps={{ style: { whiteSpace: "pre-wrap" } }}
                        >
                          {safeJSONParse(entry?.inputText)}
                        </SyntaxHighlighter>
                      )}
                    </div>
                  </div>
                  <div className="w-full md:w-1/2">
                    <div className="rounded-xl bg-white border dark:border-gray-800 dark:bg-custom-gray shadow-md p-6 w-full h-full" style={{ width: '100%' }}>
                      <div className="flex flex-col flex-1">
                          <div style={{ overflowX: 'auto' }}>
                            <label
                              htmlFor="inputText"
                              className="block mb-2 text-gray-300"
                            >
                              Result
                            </label>
                            <JSONTable jsonText={safeJSONParse(entry?.outputText)} />
                          </div>
                      </div>
                    </div>
                  </div>
                </div>                
              </div>
            ))}
        </>
      )}
      
      <Analytics />
    </div>
  );
}