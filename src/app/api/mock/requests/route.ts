import { NextRequest, NextResponse } from "next/server";
import {mongodb} from "@/lib/mongodb";
import RequestModel from "@/lib/models/RequestModel";
import { ServerResponseBuilder } from '@/lib/builders/serverResponseBuilder';
import { ResponseType } from '@/lib/types/apiResponse';

export async function GET(request: NextRequest) {
    try {
        await mongodb();

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        const query: { status?: string } = {}; 
        if (status) {
            query.status = status;
        }
        const skip = (page - 1) * limit;

        const requests = await RequestModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalDocuments = await RequestModel.countDocuments(query);
        const totalPages = Math.ceil(totalDocuments / limit);

        return NextResponse.json(
            { 
                success: true, 
                data: requests,
                pagination: {
                    currentPage: page,
                    totalPages: totalPages,
                    totalDocuments: totalDocuments,
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.log(error)
        return new ServerResponseBuilder(ResponseType.UNKNOWN_ERROR).build();
    }
}

export async function PUT(request: Request) {
    try {
        await mongodb();
        const data = await request.json();

        const newRequest = await RequestModel.create(data);
        
        return NextResponse.json(
            { success: true, data: newRequest },
            { status: 201 }

        )
    } catch (error: any) {
        console.log(error)
        return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
}

export async function PATCH(request: Request) {
    try {
        await mongodb();
        const data = await request.json();

        const { id, status } = data;
        if (!id || !status) {
            return NextResponse.json(
                {success: false, message: "Missing parameters from request"},
                { status: 400}
            );
        }

        const newRequest = await RequestModel.findByIdAndUpdate(id, {status: status}, {new: true})

        return NextResponse.json(
            { success: true, data: newRequest },
            { status: 200}
        )
    } catch (error: any) {
        console.log(error)
        return new ServerResponseBuilder(ResponseType.INVALID_INPUT).build();
    }
}