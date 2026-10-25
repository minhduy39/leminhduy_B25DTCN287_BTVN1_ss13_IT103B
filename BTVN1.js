// ==================== DỮ LIỆU BAN ĐẦU ====================
const tickets = [
    {
        pnr: "AB12CD",
        passengerName: "Nguyen Van An",
        flight: "VN201",
        seat: "12A",
        ticketClass: "ECONOMY",
        status: "BOOKED",
        baggageWeight: 0,
        baggageFee: 0
    },
    {
        pnr: "EF34GH",
        passengerName: "Tran Thi Binh",
        flight: "VN305",
        seat: "2B",
        ticketClass: "BUSINESS",
        status: "BOOKED",
        baggageWeight: 0,
        baggageFee: 0
    },
    {
        pnr: "JK56LM",
        passengerName: "Le Minh Cuong",
        flight: "VN201",
        seat: "15C",
        ticketClass: "ECONOMY",
        status: "CHECKED_IN",
        baggageWeight: 22,
        baggageFee: 100000
    }
];

const EXCESS_FEE_PER_KG = 50000;

// ==================== CÁC HÀM NGHIỆP VỤ ====================

// 1. Tìm vé theo mã PNR
const findTicketByPnr = (list, pnr) => {
    if (typeof pnr !== "string") return null;
    const normalizedPnr = pnr.trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(normalizedPnr)) return null;

    for (let i = 0; i < list.length; i++) {
        if (list[i].pnr === normalizedPnr) return list[i];
    }
    return null;
};

// 2. Tính phí hành lý quá cước
const calculateExcessBaggageFee = (ticket, weight) => {
    if (typeof weight !== "number" || !Number.isFinite(weight) || weight < 0) return null;

    let freeWeight = ticket.ticketClass === "ECONOMY" ? 20 : ticket.ticketClass === "BUSINESS" ? 30 : null;
    if (freeWeight === null) return null;

    const excessWeight = Math.max(0, weight - freeWeight);
    return Math.ceil(excessWeight) * EXCESS_FEE_PER_KG;
};

// 3. Hiển thị danh sách vé
const listTickets = (list) => {
    console.log("===== DANH SÁCH VÉ MÁY BAY =====");
    if (list.length === 0) {
        console.log("Chưa có vé nào.");
        return;
    }
    console.table(
        list.map(ticket => ({
            PNR: ticket.pnr,
            "Hành khách": ticket.passengerName,
            "Chuyến bay": ticket.flight,
            "Ghế": ticket.seat,
            "Hạng vé": ticket.ticketClass,
            "Trạng thái": ticket.status,
            "Hành lý (kg)": ticket.baggageWeight,
            "Phí hành lý (VND)": ticket.baggageFee
        }))
    );
};

// 4. Xuất thẻ lên máy bay (Boarding Pass)
const displayBoardingPass = (ticket) => {
    if (ticket.status !== "CHECKED_IN") {
        console.log("Vé chưa check-in, không thể xuất boarding pass.");
        return false;
    }

    console.log("===== BOARDING PASS =====");
    console.log("Mã PNR:", ticket.pnr);
    console.log("Hành khách:", ticket.passengerName);
    console.log("Chuyến bay:", ticket.flight);
    console.log("Số ghế:", ticket.seat);
    console.log("Hạng vé:", ticket.ticketClass);
    console.log("Hành lý:", ticket.baggageWeight, "kg");
    console.log("Phí quá cước:", ticket.baggageFee.toLocaleString("vi-VN"), "VND");
    console.log("=========================");
    return true;
};

// 5. Check-in hành khách
const checkIn = (ticket, weight) => {
    if (ticket === null) {
        console.log("Không tìm thấy vé.");
        return false;
    }
    if (ticket.status !== "BOOKED") {
        console.log("Không thể check-in. Trạng thái hiện tại:", ticket.status);
        return false;
    }
    if (typeof weight !== "number" || !Number.isFinite(weight) || weight < 0) {
        console.log("Cân nặng không hợp lệ.");
        return false;
    }

    const fee = calculateExcessBaggageFee(ticket, weight);
    if (fee === null) {
        console.log("Không thể tính phí hành lý.");
        return false;
    }

    ticket.baggageWeight = weight;
    ticket.baggageFee = fee;
    ticket.status = "CHECKED_IN";

    console.log("Check-in thành công!");
    console.log("Cân nặng:", weight, "kg");
    console.log("Phí hành lý:", fee.toLocaleString("vi-VN"), "VND");

    displayBoardingPass(ticket);
    return true;
};

// 6. Tìm kiếm vé theo PNR hoặc tên hành khách
const searchTicket = (list, keyword) => {
    if (typeof keyword !== "string" || keyword.trim() === "") {
        console.log("Từ khóa tìm kiếm không hợp lệ.");
        return [];
    }

    const normalizedKeyword = keyword.trim().toLowerCase();
    const results = list.filter(ticket =>
        ticket.pnr.toLowerCase() === normalizedKeyword ||
        ticket.passengerName.toLowerCase().includes(normalizedKeyword)
    );

    if (results.length === 0) {
        console.log("Không tìm thấy vé phù hợp.");
    } else {
        listTickets(results);
    }
    return results;
};

// 7. Hủy vé
const cancelTicket = (ticket) => {
    if (ticket === null) {
        console.log("Không tìm thấy vé.");
        return false;
    }
    if (ticket.status === "CANCELLED") {
        console.log("Vé này đã được hủy trước đó.");
        return false;
    }

    ticket.status = "CANCELLED";
    console.log("Đã hủy vé:", ticket.pnr);
    return true;
};

// ==================== HÀM CHÍNH (MAIN MENU) ====================
const main = () => {
    let menuChoice;

    do {
        const choice = prompt(
            "===== QUẢN LÝ VÉ MÁY BAY =====\n" +
            "1. Xem danh sách vé\n" +
            "2. Check-in và tính phí hành lý\n" +
            "3. Tìm vé theo PNR hoặc tên\n" +
            "4. Hủy vé\n" +
            "5. Thoát\n" +
            "Nhập lựa chọn (1-5):"
        );

        menuChoice = choice === null ? "5" : choice.trim();

        switch (menuChoice) {
            case "1":
                listTickets(tickets);
                break;

            case "2": {
                const pnrInput = prompt("Nhập mã PNR (6 ký tự):");
                if (pnrInput === null) { console.log("Đã hủy thao tác."); break; }

                const ticket = findTicketByPnr(tickets, pnrInput);
                if (ticket === null) { console.log("PNR không hợp lệ hoặc không tồn tại."); break; }

                const weightInput = prompt("Nhập cân nặng hành lý (kg):");
                if (weightInput === null || weightInput.trim() === "") { console.log("Cân nặng không hợp lệ."); break; }

                const weight = Number(weightInput);
                checkIn(ticket, weight);
                break;
            }

            case "3": {
                const keyword = prompt("Nhập PNR hoặc tên hành khách:");
                if (keyword !== null) searchTicket(tickets, keyword);
                break;
            }

            case "4": {
                const pnrInput = prompt("Nhập PNR cần hủy:");
                if (pnrInput === null) { console.log("Đã hủy thao tác."); break; }

                const ticket = findTicketByPnr(tickets, pnrInput);
                cancelTicket(ticket);
                break;
            }

            case "5":
                console.log("Đã thoát chương trình. Kết thúc ca làm việc!");
                break;

            default:
                console.log("Lựa chọn không hợp lệ. Vui lòng nhập từ 1 đến 5.");
        }
    } while (menuChoice !== "5");
};
