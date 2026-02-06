"use client";

import React, { useState } from "react";

// Sample payroll data – exactly 100 realistic entries
const initialPayrolls = [
  { id: "PAY001", month: "January 2024", period: "January 1 – January 31, 2024", totalEmployees: 84, totalGrossPay: 162400, totalDeductions: 18450, totalNetPay: 143950, status: "Completed", processedDate: "2024-01-28", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2024-01-27" },
  { id: "PAY002", month: "February 2024", period: "February 1 – February 29, 2024", totalEmployees: 85, totalGrossPay: 165200, totalDeductions: 18700, totalNetPay: 146500, status: "Completed", processedDate: "2024-02-27", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2024-02-26" },
  { id: "PAY003", month: "March 2024", period: "March 1 – March 31, 2024", totalEmployees: 86, totalGrossPay: 168900, totalDeductions: 19120, totalNetPay: 149780, status: "Completed", processedDate: "2024-03-29", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2024-03-28" },
  { id: "PAY004", month: "April 2024", period: "April 1 – April 30, 2024", totalEmployees: 87, totalGrossPay: 172300, totalDeductions: 19580, totalNetPay: 152720, status: "Completed", processedDate: "2024-04-28", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2024-04-27" },
  { id: "PAY005", month: "May 2024", period: "May 1 – May 31, 2024", totalEmployees: 88, totalGrossPay: 175800, totalDeductions: 19900, totalNetPay: 155900, status: "Completed", processedDate: "2024-05-30", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2024-05-29" },
  { id: "PAY006", month: "June 2024", period: "June 1 – June 30, 2024", totalEmployees: 89, totalGrossPay: 179200, totalDeductions: 20350, totalNetPay: 158850, status: "Completed", processedDate: "2024-06-28", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2024-06-27" },
  { id: "PAY007", month: "July 2024", period: "July 1 – July 31, 2024", totalEmployees: 90, totalGrossPay: 182700, totalDeductions: 20780, totalNetPay: 161920, status: "Completed", processedDate: "2024-07-29", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2024-07-28" },
  { id: "PAY008", month: "August 2024", period: "August 1 – August 31, 2024", totalEmployees: 91, totalGrossPay: 186100, totalDeductions: 21120, totalNetPay: 164980, status: "Completed", processedDate: "2024-08-30", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2024-08-29" },
  { id: "PAY009", month: "September 2024", period: "September 1 – September 30, 2024", totalEmployees: 90, totalGrossPay: 183500, totalDeductions: 20890, totalNetPay: 162610, status: "Completed", processedDate: "2024-09-27", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2024-09-26" },
  { id: "PAY010", month: "October 2024", period: "October 1 – October 31, 2024", totalEmployees: 89, totalGrossPay: 180200, totalDeductions: 20450, totalNetPay: 159750, status: "Completed", processedDate: "2024-10-29", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2024-10-28" },
  { id: "PAY011", month: "November 2024", period: "November 1 – November 30, 2024", totalEmployees: 88, totalGrossPay: 177800, totalDeductions: 20110, totalNetPay: 157690, status: "Completed", processedDate: "2024-11-28", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2024-11-27" },
  { id: "PAY012", month: "December 2024", period: "December 1 – December 31, 2024", totalEmployees: 87, totalGrossPay: 174900, totalDeductions: 19780, totalNetPay: 155120, status: "Completed", processedDate: "2024-12-30", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2024-12-29" },
  { id: "PAY013", month: "January 2025", period: "January 1 – January 31, 2025", totalEmployees: 86, totalGrossPay: 171600, totalDeductions: 19420, totalNetPay: 152180, status: "Completed", processedDate: "2025-01-28", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2025-01-27" },
  { id: "PAY014", month: "February 2025", period: "February 1 – February 28, 2025", totalEmployees: 87, totalGrossPay: 174300, totalDeductions: 19750, totalNetPay: 154550, status: "Completed", processedDate: "2025-02-27", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2025-02-26" },
  { id: "PAY015", month: "March 2025", period: "March 1 – March 31, 2025", totalEmployees: 88, totalGrossPay: 177000, totalDeductions: 20080, totalNetPay: 156920, status: "Completed", processedDate: "2025-03-28", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2025-03-27" },
  { id: "PAY016", month: "April 2025", period: "April 1 – April 30, 2025", totalEmployees: 89, totalGrossPay: 179800, totalDeductions: 20410, totalNetPay: 159390, status: "Completed", processedDate: "2025-04-29", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2025-04-28" },
  { id: "PAY017", month: "May 2025", period: "May 1 – May 31, 2025", totalEmployees: 90, totalGrossPay: 182500, totalDeductions: 20750, totalNetPay: 161750, status: "Completed", processedDate: "2025-05-30", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2025-05-29" },
  { id: "PAY018", month: "June 2025", period: "June 1 – June 30, 2025", totalEmployees: 91, totalGrossPay: 185200, totalDeductions: 21090, totalNetPay: 164110, status: "Completed", processedDate: "2025-06-28", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2025-06-27" },
  { id: "PAY019", month: "July 2025", period: "July 1 – July 31, 2025", totalEmployees: 90, totalGrossPay: 183900, totalDeductions: 20920, totalNetPay: 162980, status: "Completed", processedDate: "2025-07-29", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2025-07-28" },
  { id: "PAY020", month: "August 2025", period: "August 1 – August 31, 2025", totalEmployees: 89, totalGrossPay: 181600, totalDeductions: 20650, totalNetPay: 160950, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY021", month: "September 2025", period: "September 1 – September 30, 2025", totalEmployees: 88, totalGrossPay: 179300, totalDeductions: 20380, totalNetPay: 158920, status: "Completed", processedDate: "2025-09-27", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2025-09-26" },
  { id: "PAY022", month: "October 2025", period: "October 1 – October 31, 2025", totalEmployees: 87, totalGrossPay: 177000, totalDeductions: 20110, totalNetPay: 156890, status: "Completed", processedDate: "2025-10-29", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2025-10-28" },
  { id: "PAY023", month: "November 2025", period: "November 1 – November 30, 2025", totalEmployees: 86, totalGrossPay: 174700, totalDeductions: 19840, totalNetPay: 154860, status: "Completed", processedDate: "2025-11-28", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2025-11-27" },
  { id: "PAY024", month: "December 2025", period: "December 1 – December 31, 2025", totalEmployees: 85, totalGrossPay: 172400, totalDeductions: 19570, totalNetPay: 152830, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY025", month: "January 2023", period: "January 1 – January 31, 2023", totalEmployees: 80, totalGrossPay: 152000, totalDeductions: 17200, totalNetPay: 134800, status: "Completed", processedDate: "2023-01-28", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2023-01-27" },
  { id: "PAY026", month: "February 2023", period: "February 1 – February 28, 2023", totalEmployees: 81, totalGrossPay: 154500, totalDeductions: 17500, totalNetPay: 137000, status: "Completed", processedDate: "2023-02-26", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2023-02-25" },
  { id: "PAY027", month: "March 2023", period: "March 1 – March 31, 2023", totalEmployees: 81, totalGrossPay: 155200, totalDeductions: 17580, totalNetPay: 137620, status: "Completed", processedDate: "2023-03-28", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2023-03-27" },
  { id: "PAY028", month: "April 2023", period: "April 1 – April 30, 2023", totalEmployees: 82, totalGrossPay: 156800, totalDeductions: 17750, totalNetPay: 139050, status: "Completed", processedDate: "2023-04-27", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2023-04-26" },
  { id: "PAY029", month: "May 2023", period: "May 1 – May 31, 2023", totalEmployees: 82, totalGrossPay: 157400, totalDeductions: 17850, totalNetPay: 139550, status: "Completed", processedDate: "2023-05-29", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2023-05-28" },
  { id: "PAY030", month: "June 2023", period: "June 1 – June 30, 2023", totalEmployees: 83, totalGrossPay: 158900, totalDeductions: 18020, totalNetPay: 140880, status: "Completed", processedDate: "2023-06-28", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2023-06-27" },
  { id: "PAY031", month: "July 2023", period: "July 1 – July 31, 2023", totalEmployees: 83, totalGrossPay: 159600, totalDeductions: 18110, totalNetPay: 141490, status: "Completed", processedDate: "2023-07-28", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2023-07-27" },
  { id: "PAY032", month: "August 2023", period: "August 1 – August 31, 2023", totalEmployees: 84, totalGrossPay: 161200, totalDeductions: 18280, totalNetPay: 142920, status: "Completed", processedDate: "2023-08-29", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2023-08-28" },
  { id: "PAY033", month: "September 2023", period: "September 1 – September 30, 2023", totalEmployees: 84, totalGrossPay: 161800, totalDeductions: 18360, totalNetPay: 143440, status: "Completed", processedDate: "2023-09-27", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2023-09-26" },
  { id: "PAY034", month: "October 2023", period: "October 1 – October 31, 2023", totalEmployees: 85, totalGrossPay: 163500, totalDeductions: 18550, totalNetPay: 144950, status: "Completed", processedDate: "2023-10-28", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2023-10-27" },
  { id: "PAY035", month: "November 2023", period: "November 1 – November 30, 2023", totalEmployees: 85, totalGrossPay: 164100, totalDeductions: 18630, totalNetPay: 145470, status: "Completed", processedDate: "2023-11-28", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2023-11-27" },
  { id: "PAY036", month: "December 2023", period: "December 1 – December 31, 2023", totalEmployees: 86, totalGrossPay: 165800, totalDeductions: 18820, totalNetPay: 146980, status: "Completed", processedDate: "2023-12-29", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2023-12-28" },
  { id: "PAY037", month: "January 2022", period: "January 1 – January 31, 2022", totalEmployees: 75, totalGrossPay: 142000, totalDeductions: 16100, totalNetPay: 125900, status: "Completed", processedDate: "2022-01-28", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2022-01-27" },
  { id: "PAY038", month: "February 2022", period: "February 1 – February 28, 2022", totalEmployees: 76, totalGrossPay: 143600, totalDeductions: 16280, totalNetPay: 127320, status: "Completed", processedDate: "2022-02-25", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2022-02-24" },
  { id: "PAY039", month: "March 2022", period: "March 1 – March 31, 2022", totalEmployees: 76, totalGrossPay: 144200, totalDeductions: 16360, totalNetPay: 127840, status: "Completed", processedDate: "2022-03-29", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2022-03-28" },
  { id: "PAY040", month: "April 2022", period: "April 1 – April 30, 2022", totalEmployees: 77, totalGrossPay: 145900, totalDeductions: 16550, totalNetPay: 129350, status: "Completed", processedDate: "2022-04-28", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2022-04-27" },
  { id: "PAY041", month: "May 2022", period: "May 1 – May 31, 2022", totalEmployees: 77, totalGrossPay: 146500, totalDeductions: 16620, totalNetPay: 129880, status: "Completed", processedDate: "2022-05-30", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2022-05-29" },
  { id: "PAY042", month: "June 2022", period: "June 1 – June 30, 2022", totalEmployees: 78, totalGrossPay: 148200, totalDeductions: 16810, totalNetPay: 131390, status: "Completed", processedDate: "2022-06-28", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2022-06-27" },
  { id: "PAY043", month: "July 2022", period: "July 1 – July 31, 2022", totalEmployees: 78, totalGrossPay: 148800, totalDeductions: 16890, totalNetPay: 131910, status: "Completed", processedDate: "2022-07-29", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2022-07-28" },
  { id: "PAY044", month: "August 2022", period: "August 1 – August 31, 2022", totalEmployees: 79, totalGrossPay: 150500, totalDeductions: 17080, totalNetPay: 133420, status: "Completed", processedDate: "2022-08-30", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2022-08-29" },
  { id: "PAY045", month: "September 2022", period: "September 1 – September 30, 2022", totalEmployees: 79, totalGrossPay: 151100, totalDeductions: 17150, totalNetPay: 133950, status: "Completed", processedDate: "2022-09-28", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvalDate: "2022-09-27" },
  { id: "PAY046", month: "October 2022", period: "October 1 – October 31, 2022", totalEmployees: 80, totalGrossPay: 152800, totalDeductions: 17340, totalNetPay: 135460, status: "Completed", processedDate: "2022-10-28", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2022-10-27" },
  { id: "PAY047", month: "November 2022", period: "November 1 – November 30, 2022", totalEmployees: 80, totalGrossPay: 153400, totalDeductions: 17420, totalNetPay: 135980, status: "Completed", processedDate: "2022-11-28", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2022-11-27" },
  { id: "PAY048", month: "December 2022", period: "December 1 – December 31, 2022", totalEmployees: 81, totalGrossPay: 155100, totalDeductions: 17610, totalNetPay: 137490, status: "Completed", processedDate: "2022-12-29", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2022-12-28" },
  { id: "PAY049", month: "March 2026", period: "March 1 – March 31, 2026", totalEmployees: 91, totalGrossPay: 186500, totalDeductions: 21190, totalNetPay: 165310, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY050", month: "April 2026", period: "April 1 – April 30, 2026", totalEmployees: 90, totalGrossPay: 184200, totalDeductions: 20920, totalNetPay: 163280, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY051", month: "May 2026", period: "May 1 – May 31, 2026", totalEmployees: 89, totalGrossPay: 182100, totalDeductions: 20680, totalNetPay: 161420, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY052", month: "June 2026", period: "June 1 – June 30, 2026", totalEmployees: 88, totalGrossPay: 180000, totalDeductions: 20440, totalNetPay: 159560, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY053", month: "July 2026", period: "July 1 – July 31, 2026", totalEmployees: 87, totalGrossPay: 177900, totalDeductions: 20200, totalNetPay: 157700, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY054", month: "August 2026", period: "August 1 – August 31, 2026", totalEmployees: 86, totalGrossPay: 175800, totalDeductions: 19960, totalNetPay: 155840, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY055", month: "September 2026", period: "September 1 – September 30, 2026", totalEmployees: 85, totalGrossPay: 173700, totalDeductions: 19720, totalNetPay: 153980, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY056", month: "October 2026", period: "October 1 – October 31, 2026", totalEmployees: 84, totalGrossPay: 171600, totalDeductions: 19480, totalNetPay: 152120, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY057", month: "November 2026", period: "November 1 – November 30, 2026", totalEmployees: 83, totalGrossPay: 169500, totalDeductions: 19240, totalNetPay: 150260, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY058", month: "December 2026", period: "December 1 – December 31, 2026", totalEmployees: 82, totalGrossPay: 167400, totalDeductions: 19000, totalNetPay: 148400, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY059", month: "January 2027", period: "January 1 – January 31, 2027", totalEmployees: 81, totalGrossPay: 165300, totalDeductions: 18760, totalNetPay: 146540, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY060", month: "February 2027", period: "February 1 – February 28, 2027", totalEmployees: 80, totalGrossPay: 163200, totalDeductions: 18520, totalNetPay: 144680, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY061", month: "March 2027", period: "March 1 – March 31, 2027", totalEmployees: 79, totalGrossPay: 161100, totalDeductions: 18280, totalNetPay: 142820, status: "Processing", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY062", month: "April 2027", period: "April 1 – April 30, 2027", totalEmployees: 78, totalGrossPay: 159000, totalDeductions: 18040, totalNetPay: 140960, status: "Processing", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY063", month: "May 2027", period: "May 1 – May 31, 2027", totalEmployees: 77, totalGrossPay: 156900, totalDeductions: 17800, totalNetPay: 139100, status: "Completed", processedDate: "2027-05-28", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2027-05-27" },
  { id: "PAY064", month: "June 2027", period: "June 1 – June 30, 2027", totalEmployees: 76, totalGrossPay: 154800, totalDeductions: 17560, totalNetPay: 137240, status: "Completed", processedDate: "2027-06-28", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2027-06-27" },
  { id: "PAY065", month: "July 2027", period: "July 1 – July 31, 2027", totalEmployees: 75, totalGrossPay: 152700, totalDeductions: 17320, totalNetPay: 135380, status: "Completed", processedDate: "2027-07-29", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2027-07-28" },
  { id: "PAY066", month: "August 2027", period: "August 1 – August 31, 2027", totalEmployees: 74, totalGrossPay: 150600, totalDeductions: 17080, totalNetPay: 133520, status: "Completed", processedDate: "2027-08-30", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2027-08-29" },
  { id: "PAY067", month: "September 2027", period: "September 1 – September 30, 2027", totalEmployees: 73, totalGrossPay: 148500, totalDeductions: 16840, totalNetPay: 131660, status: "Completed", processedDate: "2027-09-28", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2027-09-27" },
  { id: "PAY068", month: "October 2027", period: "October 1 – October 31, 2027", totalEmployees: 72, totalGrossPay: 146400, totalDeductions: 16600, totalNetPay: 129800, status: "Completed", processedDate: "2027-10-28", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2027-10-27" },
  { id: "PAY069", month: "November 2027", period: "November 1 – November 30, 2027", totalEmployees: 71, totalGrossPay: 144300, totalDeductions: 16360, totalNetPay: 127940, status: "Completed", processedDate: "2027-11-28", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2027-11-27" },
  { id: "PAY070", month: "December 2027", period: "December 1 – December 31, 2027", totalEmployees: 70, totalGrossPay: 142200, totalDeductions: 16120, totalNetPay: 126080, status: "Completed", processedDate: "2027-12-29", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2027-12-28" },
  { id: "PAY071", month: "January 2021", period: "January 1 – January 31, 2021", totalEmployees: 70, totalGrossPay: 132000, totalDeductions: 14960, totalNetPay: 117040, status: "Completed", processedDate: "2021-01-28", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2021-01-27" },
  { id: "PAY072", month: "February 2021", period: "February 1 – February 28, 2021", totalEmployees: 71, totalGrossPay: 133900, totalDeductions: 15180, totalNetPay: 118720, status: "Completed", processedDate: "2021-02-25", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2021-02-24" },
  { id: "PAY073", month: "March 2021", period: "March 1 – March 31, 2021", totalEmployees: 71, totalGrossPay: 134500, totalDeductions: 15250, totalNetPay: 119250, status: "Completed", processedDate: "2021-03-29", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2021-03-28" },
  { id: "PAY074", month: "April 2021", period: "April 1 – April 30, 2021", totalEmployees: 72, totalGrossPay: 136200, totalDeductions: 15440, totalNetPay: 120760, status: "Completed", processedDate: "2021-04-28", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2021-04-27" },
  { id: "PAY075", month: "May 2021", period: "May 1 – May 31, 2021", totalEmployees: 72, totalGrossPay: 136800, totalDeductions: 15510, totalNetPay: 121290, status: "Completed", processedDate: "2021-05-28", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2021-05-27" },
  { id: "PAY076", month: "June 2021", period: "June 1 – June 30, 2021", totalEmployees: 73, totalGrossPay: 138500, totalDeductions: 15700, totalNetPay: 122800, status: "Completed", processedDate: "2021-06-28", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2021-06-27" },
  { id: "PAY077", month: "July 2021", period: "July 1 – July 31, 2021", totalEmployees: 73, totalGrossPay: 139100, totalDeductions: 15770, totalNetPay: 123330, status: "Completed", processedDate: "2021-07-29", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2021-07-28" },
  { id: "PAY078", month: "August 2021", period: "August 1 – August 31, 2021", totalEmployees: 74, totalGrossPay: 140800, totalDeductions: 15960, totalNetPay: 124840, status: "Completed", processedDate: "2021-08-30", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2021-08-29" },
  { id: "PAY079", month: "September 2021", period: "September 1 – September 30, 2021", totalEmployees: 74, totalGrossPay: 141400, totalDeductions: 16030, totalNetPay: 125370, status: "Completed", processedDate: "2021-09-28", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2021-09-27" },
  { id: "PAY080", month: "October 2021", period: "October 1 – October 31, 2021", totalEmployees: 75, totalGrossPay: 143100, totalDeductions: 16220, totalNetPay: 126880, status: "Completed", processedDate: "2021-10-28", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2021-10-27" },
  { id: "PAY081", month: "November 2021", period: "November 1 – November 30, 2021", totalEmployees: 75, totalGrossPay: 143700, totalDeductions: 16290, totalNetPay: 127410, status: "Completed", processedDate: "2021-11-28", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2021-11-27" },
  { id: "PAY082", month: "December 2021", period: "December 1 – December 31, 2021", totalEmployees: 76, totalGrossPay: 145400, totalDeductions: 16480, totalNetPay: 128920, status: "Completed", processedDate: "2021-12-29", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2021-12-28" },
  { id: "PAY083", month: "January 2020", period: "January 1 – January 31, 2020", totalEmployees: 65, totalGrossPay: 122000, totalDeductions: 13840, totalNetPay: 108160, status: "Completed", processedDate: "2020-01-28", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2020-01-27" },
  { id: "PAY084", month: "February 2020", period: "February 1 – February 29, 2020", totalEmployees: 66, totalGrossPay: 123700, totalDeductions: 14030, totalNetPay: 109670, status: "Completed", processedDate: "2020-02-27", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2020-02-26" },
  { id: "PAY085", month: "March 2020", period: "March 1 – March 31, 2020", totalEmployees: 66, totalGrossPay: 124300, totalDeductions: 14100, totalNetPay: 110200, status: "Completed", processedDate: "2020-03-28", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2020-03-27" },
  { id: "PAY086", month: "April 2020", period: "April 1 – April 30, 2020", totalEmployees: 67, totalGrossPay: 126000, totalDeductions: 14290, totalNetPay: 111710, status: "Completed", processedDate: "2020-04-28", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2020-04-27" },
  { id: "PAY087", month: "May 2020", period: "May 1 – May 31, 2020", totalEmployees: 67, totalGrossPay: 126600, totalDeductions: 14360, totalNetPay: 112240, status: "Completed", processedDate: "2020-05-29", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2020-05-28" },
  { id: "PAY088", month: "June 2020", period: "June 1 – June 30, 2020", totalEmployees: 68, totalGrossPay: 128300, totalDeductions: 14550, totalNetPay: 113750, status: "Completed", processedDate: "2020-06-28", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2020-06-27" },
  { id: "PAY089", month: "July 2020", period: "July 1 – July 31, 2020", totalEmployees: 68, totalGrossPay: 128900, totalDeductions: 14620, totalNetPay: 114280, status: "Completed", processedDate: "2020-07-29", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2020-07-28" },
  { id: "PAY090", month: "August 2020", period: "August 1 – August 31, 2020", totalEmployees: 69, totalGrossPay: 130600, totalDeductions: 14810, totalNetPay: 115790, status: "Completed", processedDate: "2020-08-28", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2020-08-27" },
  { id: "PAY091", month: "September 2020", period: "September 1 – September 30, 2020", totalEmployees: 69, totalGrossPay: 131200, totalDeductions: 14880, totalNetPay: 116320, status: "Completed", processedDate: "2020-09-28", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2020-09-27" },
  { id: "PAY092", month: "October 2020", period: "October 1 – October 31, 2020", totalEmployees: 70, totalGrossPay: 132900, totalDeductions: 15070, totalNetPay: 117830, status: "Completed", processedDate: "2020-10-29", processedBy: "Ama Serwaa", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2020-10-28" },
  { id: "PAY093", month: "November 2020", period: "November 1 – November 30, 2020", totalEmployees: 70, totalGrossPay: 133500, totalDeductions: 15140, totalNetPay: 118360, status: "Completed", processedDate: "2020-11-27", processedBy: "Kofi Boateng", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2020-11-26" },
  { id: "PAY094", month: "December 2020", period: "December 1 – December 31, 2020", totalEmployees: 71, totalGrossPay: 135200, totalDeductions: 15330, totalNetPay: 119870, status: "Completed", processedDate: "2020-12-29", processedBy: "Efua Addo", approvalStatus: "Approved", approvedBy: "Michael Owusu", approvedDate: "2020-12-28" },
  { id: "PAY095", month: "May 2026", period: "May 1 – May 31, 2026", totalEmployees: 94, totalGrossPay: 192800, totalDeductions: 21920, totalNetPay: 170880, status: "Processing", processedDate: "2026-05-27", processedBy: "Kofi Boateng", approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY096", month: "June 2026", period: "June 1 – June 30, 2026", totalEmployees: 92, totalGrossPay: 188400, totalDeductions: 21400, totalNetPay: 167000, status: "Completed", processedDate: "2026-06-29", processedBy: "John Mensah", approvalStatus: "Approved", approvedBy: "Sarah Johnson", approvedDate: "2026-06-28" },
  { id: "PAY097", month: "July 2026", period: "July 1 – July 31, 2026", totalEmployees: 93, totalGrossPay: 191100, totalDeductions: 21730, totalNetPay: 169370, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY098", month: "August 2026", period: "August 1 – August 31, 2026", totalEmployees: 92, totalGrossPay: 188800, totalDeductions: 21460, totalNetPay: 167340, status: "Processing", processedDate: "2026-08-25", processedBy: "Ama Serwaa", approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY099", month: "September 2026", period: "September 1 – September 30, 2026", totalEmployees: 91, totalGrossPay: 186500, totalDeductions: 21190, totalNetPay: 165310, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null },
  { id: "PAY100", month: "October 2026", period: "October 1 – October 31, 2026", totalEmployees: 90, totalGrossPay: 184200, totalDeductions: 20920, totalNetPay: 163280, status: "Pending", processedDate: null, processedBy: null, approvalStatus: "Pending", approvedBy: null, approvedDate: null }
];

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState(initialPayrolls);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Process Payroll Form State
  const [processFormData, setProcessFormData] = useState({
    month: "",
    year: "",
    startDate: "",
    endDate: "",
    includeBonuses: true,
    includeAllowances: true,
    deductTaxes: true,
    deductSSNIT: true,
  });

  // Filter payrolls by status
  const filteredPayrolls = filterStatus === "All" 
    ? payrolls 
    : payrolls.filter(p => p.status === filterStatus);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPayrolls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayrolls = filteredPayrolls.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  const getStatusColor = (status) => {
    switch(status) {
      case "Completed": return "bg-green-100 text-green-700 border-green-200";
      case "Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Processing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Failed": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getApprovalColor = (status) => {
    switch(status) {
      case "Approved": return "bg-green-100 text-green-700";
      case "Pending": return "bg-yellow-100 text-yellow-700";
      case "Rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // ────────────────────────────────────────────────
  //                API / Action Handlers
  // ────────────────────────────────────────────────

  const handleFetchAllPayrolls = () => {
    console.log("GET: Fetch all payrolls");
    alert("Fetching all payrolls from API...");
  };

  const handleProcessPayroll = (e) => {
    e.preventDefault();
    console.log("POST: Process payroll for", processFormData);

    const newPayroll = {
      id: `PAY${String(payrolls.length + 1).padStart(3, '0')}`,
      month: `${processFormData.month} ${processFormData.year}`,
      period: `${processFormData.startDate} – ${processFormData.endDate}`,
      totalEmployees: 89 + Math.floor(Math.random() * 5),
      totalGrossPay: 182500 + Math.floor(Math.random() * 15000),
      totalDeductions: 19100 + Math.floor(Math.random() * 3000),
      totalNetPay: 0,
      status: "Processing",
      processedDate: new Date().toISOString().split('T')[0],
      processedBy: "Current User",
      approvalStatus: "Pending",
      approvedBy: null,
      approvedDate: null,
    };
    newPayroll.totalNetPay = newPayroll.totalGrossPay - newPayroll.totalDeductions;

    setPayrolls([newPayroll, ...payrolls]);
    setIsProcessModalOpen(false);
    setProcessFormData({
      month: "", year: "", startDate: "", endDate: "",
      includeBonuses: true, includeAllowances: true,
      deductTaxes: true, deductSSNIT: true,
    });
    
    alert("Payroll processing initiated!");
  };

  const handleFetchPayrollDetails = (payroll) => {
    setSelectedPayroll(payroll);
    setIsDetailModalOpen(true);
  };

  const handleUpdatePayroll = (payrollId) => {
    alert(`Updating payroll ${payrollId} (placeholder)`);
  };

  const handleDeletePayroll = () => {
    setPayrolls(payrolls.filter(p => p.id !== selectedPayroll.id));
    setIsDeleteModalOpen(false);
    setSelectedPayroll(null);
    alert("Payroll deleted!");
  };

  const handleApprovePayroll = (payrollId) => {
    setPayrolls(payrolls.map(p => 
      p.id === payrollId 
        ? { ...p, approvalStatus: "Approved", approvedBy: "Current User", approvedDate: new Date().toISOString().split('T')[0] }
        : p
    ));
    alert("Payroll approved!");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-4 md:p-6 xl:p-8 bg-gray-50 min-h-screen">
      {/* ──────────────────────────────────────────────── */}
      {/* Header + Actions */}
      {/* ──────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#153453] mb-2">Payroll Management</h1>
            <p className="text-sm text-gray-600">Process, manage and approve employee payrolls</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleFetchAllPayrolls}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={() => setIsProcessModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] hover:from-[#1e3147] hover:to-[#2c4a6a] text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Process New Payroll
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
  
  <div className="bg-blue-50 rounded-xl border border-blue-200 p-5 shadow-sm hover:shadow-md transition">
    <h3 className="text-sm font-medium text-black mb-2">
      Total Allowances
    </h3>
    <p className="text-2xl md:text-3xl font-bold text-black">
      ₵48,750
    </p>
    <p className="text-xs text-black mt-1">
      This payroll cycle
    </p>
  </div>

  <div className="bg-blue-50 rounded-xl border border-blue-200 p-5 shadow-sm hover:shadow-md transition">
    <h3 className="text-sm font-medium text-black mb-2">
      Total Deductions
    </h3>
    <p className="text-2xl md:text-3xl font-bold text-black">
      ₵32,180
    </p>
    <p className="text-xs text-black mt-1">
      Tax + SSNIT + Others
    </p>
  </div>

  <div className="bg-blue-50 rounded-xl border border-blue-200 p-5 shadow-sm hover:shadow-md transition">
    <h3 className="text-sm font-medium text-black mb-2">
      Active Benefits
    </h3>
    <p className="text-2xl md:text-3xl font-bold text-black">
      14
    </p>
    <p className="text-xs text-black mt-1">
      Assigned to employees
    </p>
  </div>

  <div className="bg-blue-50 rounded-xl border border-blue-200 p-5 shadow-sm hover:shadow-md transition">
    <h3 className="text-sm font-medium text-black mb-2">
      Currency
    </h3>
    <p className="text-2xl md:text-3xl font-bold text-black">
      ₵
    </p>
    <p className="text-xs text-black mt-1">
      Default payroll currency
    </p>
  </div>

</div>


      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl shadow-sm p-1.5 mb-6 inline-flex gap-1">
        {["All", "Completed", "Pending", "Processing"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              filterStatus === status
                ? "bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Items per page selector */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredPayrolls.length)} of {filteredPayrolls.length} entries
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gradient-to-r from-[#2c4a6a]/5 to-[#1e3147]/5 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Payroll ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Period</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Employees</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Gross Pay</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Deductions</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Net Pay</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Status</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Approval</th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-[#2c4a6a]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPayrolls.map((payroll, index) => (
                <tr 
                  key={payroll.id} 
                  className={`border-b border-gray-100 hover:bg-[#2c4a6a]/5 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2c4a6a] to-[#1e3147] flex items-center justify-center text-white font-bold text-xs">
                        {payroll.id.slice(-2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{payroll.id}</p>
                        <p className="text-xs text-gray-500">{payroll.month}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-900">{payroll.period}</p>
                    {payroll.processedDate && (
                      <p className="text-xs text-gray-500 mt-1">Processed: {payroll.processedDate}</p>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#6b8ca3]/20 text-[#2c4a6a] font-bold text-sm">
                      {payroll.totalEmployees}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <p className="text-sm font-semibold text-gray-900">₵ {payroll.totalGrossPay.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <p className="text-sm font-semibold text-red-600">₵ {payroll.totalDeductions.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <p className="text-base font-bold text-[#2c4a6a]">₵ {payroll.totalNetPay.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(payroll.status)}`}>
                      {payroll.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${getApprovalColor(payroll.approvalStatus)}`}>
                      {payroll.approvalStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleFetchPayrollDetails(payroll)}
                        className="p-2 hover:bg-[#6b8ca3]/10 rounded-lg transition-colors group"
                        title="View Details"
                      >
                        <svg className="w-5 h-5 text-[#6b8ca3] group-hover:text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleUpdatePayroll(payroll.id)}
                        className="p-2 hover:bg-[#6b8ca3]/10 rounded-lg transition-colors group"
                        title="Update"
                      >
                        <svg className="w-5 h-5 text-[#6b8ca3] group-hover:text-[#2c4a6a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      {payroll.approvalStatus === "Pending" && (
                        <button
                          onClick={() => handleApprovePayroll(payroll.id)}
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                          title="Approve"
                        >
                          <svg className="w-5 h-5 text-[#6b8ca3] group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedPayroll(payroll);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                        title="Delete"
                      >
                        <svg className="w-5 h-5 text-[#6b8ca3] group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayrolls.length === 0 && (
          <div className="py-16 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No payrolls found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your filter or process a new payroll</p>
            <button
              onClick={() => setFilterStatus("All")}
              className="text-[#2c4a6a] hover:underline text-sm font-medium"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredPayrolls.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredPayrolls.length)} of {filteredPayrolls.length} entries
              </div>
              
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Process Payroll Modal */}
      {isProcessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-xl font-bold">Process New Payroll</h2>
              <button onClick={() => setIsProcessModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleProcessPayroll} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month *</label>
                  <select 
                    value={processFormData.month} 
                    onChange={e => setProcessFormData({...processFormData, month: e.target.value})} 
                    required 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
                  >
                    <option value="">Select Month</option>
                    {["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                  <select 
                    value={processFormData.year} 
                    onChange={e => setProcessFormData({...processFormData, year: e.target.value})} 
                    required 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
                  >
                    <option value="">Select Year</option>
                    {[2024, 2025, 2026].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                  <input
                    type="date"
                    value={processFormData.startDate}
                    onChange={e => setProcessFormData({...processFormData, startDate: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                  <input
                    type="date"
                    value={processFormData.endDate}
                    onChange={e => setProcessFormData({...processFormData, endDate: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2c4a6a]"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Payroll Options</label>
                <div className="space-y-3">
                  {[
                    { key: 'includeBonuses', label: 'Include Bonuses' },
                    { key: 'includeAllowances', label: 'Include Allowances' },
                    { key: 'deductTaxes', label: 'Deduct Taxes' },
                    { key: 'deductSSNIT', label: 'Deduct SSNIT' }
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={processFormData[key]}
                        onChange={e => setProcessFormData({...processFormData, [key]: e.target.checked})}
                        className="w-5 h-5 text-[#2c4a6a] rounded focus:ring-[#2c4a6a]"
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-800">Processing payroll will calculate salaries for all active employees based on the selected period and options.</p>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setIsProcessModalOpen(false)} 
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white rounded-lg text-sm font-medium hover:from-[#1e3147] hover:to-[#2c4a6a] transition-all"
                >
                  Process Payroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#2c4a6a] to-[#1e3147] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-xl font-bold">Payroll Details - {selectedPayroll.id}</h2>
              <button onClick={() => setIsDetailModalOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Month</p>
                  <p className="text-base font-semibold text-gray-900">{selectedPayroll.month}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Period</p>
                  <p className="text-base font-semibold text-gray-900">{selectedPayroll.period}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Total Employees</p>
                  <p className="text-base font-semibold text-gray-900">{selectedPayroll.totalEmployees}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedPayroll.status)}`}>
                    {selectedPayroll.status}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Gross Pay</p>
                  <p className="text-base font-semibold text-gray-900">₵ {selectedPayroll.totalGrossPay.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Deductions</p>
                  <p className="text-base font-semibold text-red-600">₵ {selectedPayroll.totalDeductions.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Net Pay</p>
                  <p className="text-xl font-bold text-[#2c4a6a]">₵ {selectedPayroll.totalNetPay.toLocaleString()}</p>
                </div>
                {selectedPayroll.processedDate && (
                  <>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Processed Date</p>
                      <p className="text-base font-semibold text-gray-900">{selectedPayroll.processedDate}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Processed By</p>
                      <p className="text-base font-semibold text-gray-900">{selectedPayroll.processedBy}</p>
                    </div>
                  </>
                )}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Approval Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getApprovalColor(selectedPayroll.approvalStatus)}`}>
                    {selectedPayroll.approvalStatus}
                  </span>
                </div>
                {selectedPayroll.approvedBy && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Approved By</p>
                    <p className="text-base font-semibold text-gray-900">{selectedPayroll.approvedBy}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Payroll</h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Are you sure you want to delete payroll <strong>{selectedPayroll.id}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeletePayroll}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}